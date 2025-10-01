#!/usr/bin/env python3
"""
SuperMittos Backend Server - PostgreSQL/Supabase Version
Servidor Python para análise de futebol integrado com banco PostgreSQL
"""

import os
import json
import logging
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from typing import Dict, List, Any, Optional
import uuid

# Database imports
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import psycopg2.pool
    DATABASE_AVAILABLE = True
except ImportError:
    print("⚠️  psycopg2 não instalado. Instale com: pip install psycopg2-binary")
    DATABASE_AVAILABLE = False

try:
    from dotenv import load_dotenv
    load_dotenv()
    ENV_AVAILABLE = True
except ImportError:
    print("⚠️  python-dotenv não instalado. Instale com: pip install python-dotenv")
    ENV_AVAILABLE = False

# Configuração de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Gerenciador de conexão com PostgreSQL/Supabase"""
    
    def __init__(self):
        self.connection_pool = None
        self.init_connection()
    
    def init_connection(self):
        """Inicializa o pool de conexões"""
        try:
            # Configurações do banco
            db_config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': os.getenv('DB_PORT', '5432'),
                'database': os.getenv('DB_NAME', 'supermittos'),
                'user': os.getenv('DB_USER', 'postgres'),
                'password': os.getenv('DB_PASSWORD', ''),
            }
            
            # Tentar usar DATABASE_URL se disponível
            database_url = os.getenv('DATABASE_URL')
            if database_url:
                self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                    1, 20, database_url
                )
            else:
                self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                    1, 20, **db_config
                )
            
            logger.info("✅ Conexão com banco PostgreSQL estabelecida")
            
            # Testar conexão
            self.test_connection()
            
        except Exception as e:
            logger.error(f"❌ Erro ao conectar ao banco: {e}")
            self.connection_pool = None
    
    def test_connection(self):
        """Testa a conexão com o banco"""
        try:
            conn = self.get_connection()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT version();")
                    version = cur.fetchone()[0]
                    logger.info(f"✅ PostgreSQL conectado: {version}")
                self.return_connection(conn)
        except Exception as e:
            logger.error(f"❌ Erro ao testar conexão: {e}")
    
    def get_connection(self):
        """Obtém uma conexão do pool"""
        if self.connection_pool:
            try:
                return self.connection_pool.getconn()
            except Exception as e:
                logger.error(f"Erro ao obter conexão: {e}")
        return None
    
    def return_connection(self, conn):
        """Retorna uma conexão para o pool"""
        if self.connection_pool and conn:
            self.connection_pool.putconn(conn)
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict]:
        """Executa uma query e retorna os resultados"""
        conn = self.get_connection()
        if not conn:
            return []
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                if cur.description:
                    return [dict(row) for row in cur.fetchall()]
                return []
        except Exception as e:
            logger.error(f"Erro ao executar query: {e}")
            return []
        finally:
            self.return_connection(conn)

# Instância global do banco
db_manager = DatabaseManager() if DATABASE_AVAILABLE else None

class SuperMittosHandler(BaseHTTPRequestHandler):
    """Handler principal do servidor SuperMittos"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def send_cors_headers(self):
        """Envia headers CORS"""
        allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
        origin = self.headers.get('Origin', '')
        
        if origin in allowed_origins or '*' in allowed_origins:
            self.send_header('Access-Control-Allow-Origin', origin)
        
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Credentials', 'true')
    
    def send_json_response(self, data: Any, status_code: int = 200):
        """Envia resposta JSON"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_cors_headers()
        self.end_headers()
        
        json_data = json.dumps(data, ensure_ascii=False, default=str)
        self.wfile.write(json_data.encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests"""
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            params = parse_qs(parsed_url.query)
            
            # Health check
            if path == '/':
                self.send_json_response({
                    "message": "SuperMittos API is running! ⚽",
                    "version": "2.0.0",
                    "status": "healthy",
                    "database": "connected" if db_manager and db_manager.connection_pool else "disconnected",
                    "timestamp": datetime.now().isoformat()
                })
                return
            
            # API routes
            if path.startswith('/api/'):
                self.handle_api_request(path, params)
            else:
                self.send_json_response({"error": "Endpoint não encontrado"}, 404)
                
        except Exception as e:
            logger.error(f"Erro no GET: {e}")
            self.send_json_response({"error": "Erro interno do servidor"}, 500)
    
    def handle_api_request(self, path: str, params: Dict):
        """Handle API requests"""
        
        # Jogadores
        if path == '/api/players':
            self.get_players(params)
        
        # Dashboard
        elif path == '/api/dashboard':
            self.get_dashboard_data()
        
        # Status do mercado
        elif path == '/api/market-status':
            self.get_market_status()
        
        # Sugestões
        elif path == '/api/suggestions':
            self.get_suggestions(params)
        
        # Time optimizer
        elif path == '/api/optimize-team':
            self.optimize_team(params)
        
        else:
            self.send_json_response({"error": "Endpoint da API não encontrado"}, 404)
    
    def get_players(self, params: Dict):
        """Busca jogadores do banco"""
        if not db_manager:
            # Fallback para dados mock se banco não disponível
            mock_players = [
                {"id": 1, "name": "Cristiano Ronaldo", "position": "ATA", "team": "Al Nassr", "price": 15000000, "rating": 95},
                {"id": 2, "name": "Lionel Messi", "position": "ATA", "team": "Inter Miami", "price": 12000000, "rating": 94},
                {"id": 3, "name": "Neymar Jr", "position": "ATA", "team": "Al Hilal", "price": 10000000, "rating": 90},
                {"id": 4, "name": "Kylian Mbappé", "position": "ATA", "team": "Real Madrid", "price": 18000000, "rating": 92},
                {"id": 5, "name": "Erling Haaland", "position": "ATA", "team": "Manchester City", "price": 16000000, "rating": 91}
            ]
            self.send_json_response(mock_players)
            return
        
        try:
            # Query do banco real
            query = """
            SELECT 
                jogador_id as id,
                nome as name,
                posicao_nome as position,
                clube_nome as team,
                COALESCE(valor_mercado, 1000000) as price,
                85 + (RANDOM() * 15)::int as rating
            FROM supermittos.jogadores 
            WHERE status_ativo = true
            ORDER BY nome
            LIMIT 50
            """
            
            players = db_manager.execute_query(query)
            self.send_json_response(players)
            
        except Exception as e:
            logger.error(f"Erro ao buscar jogadores: {e}")
            self.send_json_response({"error": "Erro ao buscar jogadores"}, 500)
    
    def get_dashboard_data(self):
        """Dados do dashboard"""
        if not db_manager:
            # Mock data
            mock_data = {
                "totalPlayers": 150,
                "activeOffers": 1250,
                "avgPrice": 5500000,
                "topPlayer": "Cristiano Ronaldo"
            }
            self.send_json_response(mock_data)
            return
        
        try:
            # Stats do banco real
            queries = {
                'total_players': "SELECT COUNT(*) as count FROM supermittos.jogadores WHERE status_ativo = true",
                'avg_price': "SELECT AVG(COALESCE(valor_mercado, 1000000)) as avg FROM supermittos.jogadores WHERE status_ativo = true",
                'top_player': "SELECT nome FROM supermittos.jogadores WHERE status_ativo = true ORDER BY COALESCE(valor_mercado, 0) DESC LIMIT 1"
            }
            
            total_players = db_manager.execute_query(queries['total_players'])
            avg_price = db_manager.execute_query(queries['avg_price'])
            top_player = db_manager.execute_query(queries['top_player'])
            
            dashboard_data = {
                "totalPlayers": total_players[0]['count'] if total_players else 0,
                "activeOffers": 1250,  # Mock por enquanto
                "avgPrice": float(avg_price[0]['avg']) if avg_price else 5500000,
                "topPlayer": top_player[0]['nome'] if top_player else "N/A"
            }
            
            self.send_json_response(dashboard_data)
            
        except Exception as e:
            logger.error(f"Erro ao buscar dados do dashboard: {e}")
            self.send_json_response({"error": "Erro ao buscar dados do dashboard"}, 500)
    
    def get_market_status(self):
        """Status do mercado"""
        if not db_manager:
            mock_data = {
                "status": "aberto",
                "totalOffers": 2430,
                "avgPrice": 5500000,
                "topCategories": [
                    {"name": "Atacantes", "count": 890},
                    {"name": "Meio-campistas", "count": 720},
                    {"name": "Zagueiros", "count": 520},
                    {"name": "Goleiros", "count": 300}
                ]
            }
            self.send_json_response(mock_data)
            return
        
        try:
            # Query do banco real
            market_query = """
            SELECT 
                mercado_aberto,
                rodada_atual
            FROM supermittos.mercado_status 
            ORDER BY created_at DESC 
            LIMIT 1
            """
            
            market_data = db_manager.execute_query(market_query)
            
            response_data = {
                "status": "aberto" if (market_data and market_data[0]['mercado_aberto']) else "fechado",
                "totalOffers": 2430,
                "avgPrice": 5500000,
                "topCategories": [
                    {"name": "Atacantes", "count": 890},
                    {"name": "Meio-campistas", "count": 720},
                    {"name": "Zagueiros", "count": 520},
                    {"name": "Goleiros", "count": 300}
                ]
            }
            
            self.send_json_response(response_data)
            
        except Exception as e:
            logger.error(f"Erro ao buscar status do mercado: {e}")
            self.send_json_response({"error": "Erro ao buscar status do mercado"}, 500)
    
    def get_suggestions(self, params: Dict):
        """Sugestões de jogadores"""
        mock_suggestions = [
            {
                "id": 1,
                "type": "buy",
                "player": "Vinícius Jr",
                "reason": "Em alta forma, 3 gols nos últimos 2 jogos",
                "confidence": 85,
                "expectedReturn": 15.5
            },
            {
                "id": 2,
                "type": "sell",
                "player": "Casemiro",
                "reason": "Preço alto, performance inconsistente",
                "confidence": 70,
                "expectedReturn": -5.2
            }
        ]
        
        self.send_json_response(mock_suggestions)
    
    def optimize_team(self, params: Dict):
        """Otimização de time"""
        budget = params.get('budget', [100000000])[0]
        formation = params.get('formation', ['4-3-3'])[0]
        
        mock_team = {
            "formation": formation,
            "totalCost": int(budget) * 0.9,
            "expectedPoints": 85.5,
            "players": [
                {"name": "Alisson", "position": "GOL", "price": 8000000, "expectedPoints": 7.2},
                {"name": "Dani Alves", "position": "LAT", "price": 5000000, "expectedPoints": 6.8},
                {"name": "Marquinhos", "position": "ZAG", "price": 12000000, "expectedPoints": 7.5},
                {"name": "Thiago Silva", "position": "ZAG", "price": 8000000, "expectedPoints": 7.0}
            ]
        }
        
        self.send_json_response(mock_team)

def run_server():
    """Executa o servidor"""
    port = int(os.getenv('PORT', 8000))
    
    print(f"""
🚀 SuperMittos Backend Server v2.0 - PostgreSQL/Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Servidor:        http://localhost:{port}
💾 Banco:           {"✅ PostgreSQL conectado" if db_manager and db_manager.connection_pool else "❌ Sem conexão"}
🌐 CORS:            Habilitado
📊 API Endpoints:   /api/players, /api/dashboard, /api/market-status

💡 Para parar o servidor: Ctrl+C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """)
    
    try:
        server = HTTPServer(('0.0.0.0', port), SuperMittosHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Servidor SuperMittos finalizado.")
    except Exception as e:
        print(f"\n❌ Erro ao iniciar servidor: {e}")

if __name__ == '__main__':
    run_server()