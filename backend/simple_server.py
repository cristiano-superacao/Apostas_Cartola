"""
SuperMittos API - Servidor de teste ultra-simples
Usando apenas bibliotecas padrão do Python para evitar problemas de compatibilidade
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
import socket

class SuperMittosHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        """Define headers CORS e JSON"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self._set_headers()

    def do_GET(self):
        """Handle GET requests"""
        path = urlparse(self.path).path
        query = parse_qs(urlparse(self.path).query)
        
        try:
            if path == '/':
                response = {
                    "message": "SuperMittos API is running! ⚽",
                    "version": "1.0.0",
                    "status": "healthy",
                    "timestamp": datetime.now().isoformat()
                }
            elif path == '/health':
                response = {
                    "status": "healthy",
                    "database": "simulated",
                    "timestamp": datetime.now().isoformat()
                }
            elif path == '/api/v1/players':
                response = {
                    "data": [
                        {
                            "id": "1",
                            "cartola_id": 1001,
                            "name": "Gabriel Jesus",
                            "nickname": "Gabriel Jesus",
                            "club_name": "Arsenal",
                            "position_name": "Atacante",
                            "position_abbrev": "ATA",
                            "current_price": 15.50,
                            "avg_score": 8.5,
                            "recent_form": 9.2,
                            "consistency": 7.8,
                            "prob_starter": 0.85,
                            "active": True
                        },
                        {
                            "id": "2",
                            "cartola_id": 1002,
                            "name": "Bruno Henrique",
                            "nickname": "Bruno Henrique",
                            "club_name": "Flamengo",
                            "position_name": "Atacante",
                            "position_abbrev": "ATA",
                            "current_price": 12.80,
                            "avg_score": 6.2,
                            "recent_form": 7.1,
                            "consistency": 6.5,
                            "prob_starter": 0.75,
                            "active": True
                        },
                        {
                            "id": "3",
                            "cartola_id": 1003,
                            "name": "Raphinha",
                            "nickname": "Raphinha",
                            "club_name": "Barcelona",
                            "position_name": "Meia",
                            "position_abbrev": "MEI",
                            "current_price": 18.90,
                            "avg_score": 11.4,
                            "recent_form": 12.1,
                            "consistency": 8.9,
                            "prob_starter": 0.90,
                            "active": True
                        },
                        {
                            "id": "4",
                            "cartola_id": 1004,
                            "name": "Alisson",
                            "nickname": "Alisson",
                            "club_name": "Liverpool",
                            "position_name": "Goleiro",
                            "position_abbrev": "GOL",
                            "current_price": 8.50,
                            "avg_score": 7.2,
                            "recent_form": 8.0,
                            "consistency": 8.5,
                            "prob_starter": 0.95,
                            "active": True
                        },
                        {
                            "id": "5",
                            "cartola_id": 1005,
                            "name": "Marquinhos",
                            "nickname": "Marquinhos",
                            "club_name": "PSG",
                            "position_name": "Zagueiro",
                            "position_abbrev": "ZAG",
                            "current_price": 7.20,
                            "avg_score": 6.8,
                            "recent_form": 7.5,
                            "consistency": 7.9,
                            "prob_starter": 0.88,
                            "active": True
                        }
                    ],
                    "total": 5,
                    "timestamp": datetime.now().isoformat()
                }
            elif path == '/api/v1/suggestions':
                response = {
                    "data": [
                        {
                            "id": "1",
                            "round_number": 38,
                            "formation": "4-3-3",
                            "strategy": "conservative",
                            "expected_score": 45.8,
                            "total_cost": 100.0,
                            "expected_roi": 0.458,
                            "created_at": datetime.now().isoformat(),
                            "players": [
                                {"player_name": "Alisson", "position": "GOL", "captain": False, "vice_captain": False},
                                {"player_name": "Marquinhos", "position": "ZAG", "captain": False, "vice_captain": False},
                                {"player_name": "Raphinha", "position": "MEI", "captain": True, "vice_captain": False},
                                {"player_name": "Gabriel Jesus", "position": "ATA", "captain": False, "vice_captain": True}
                            ]
                        }
                    ],
                    "total": 1,
                    "timestamp": datetime.now().isoformat()
                }
            elif path == '/api/v1/market/status':
                response = {
                    "data": {
                        "current_round": 38,
                        "market_open": True,
                        "season": "2025",
                        "last_updated": datetime.now().isoformat()
                    }
                }
            elif path == '/api/v1/etl/status':
                response = {
                    "data": {
                        "is_running": False,
                        "last_execution": (datetime.now() - timedelta(minutes=30)).isoformat(),
                        "last_duration": 45.2,
                        "status": "completed",
                        "players_processed": 1500,
                        "success": True,
                        "error_message": None
                    }
                }
            elif path == '/api/v1/analytics/dashboard':
                response = {
                    "data": {
                        "total_players": 1500,
                        "market_stats": {
                            "avg_price": 8.45,
                            "min_price": 3.50,
                            "max_price": 25.80
                        },
                        "position_distribution": [
                            {"position": "GOL", "count": 150, "avg_score": 7.2},
                            {"position": "ZAG", "count": 300, "avg_score": 6.8},
                            {"position": "LAT", "count": 200, "avg_score": 7.1},
                            {"position": "MEI", "count": 400, "avg_score": 8.3},
                            {"position": "ATA", "count": 450, "avg_score": 9.1}
                        ],
                        "last_updated": datetime.now().isoformat()
                    }
                }
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {"error": "Endpoint not found", "path": path}

            self._set_headers()
            self.wfile.write(json.dumps(response, indent=2, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {"error": str(e), "timestamp": datetime.now().isoformat()}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def log_message(self, format, *args):
        """Log com timestamp"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def find_free_port():
    """Encontra uma porta livre"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

def run_server(port=8000):
    """Executa o servidor"""
    try:
        server_address = ('', port)
        httpd = HTTPServer(server_address, SuperMittosHandler)
        print(f"🚀 SuperMittos API rodando em http://localhost:{port}")
        print(f"📊 Endpoints disponíveis:")
        print(f"   • GET /health - Status da API")
        print(f"   • GET /api/v1/players - Lista de jogadores")
        print(f"   • GET /api/v1/suggestions - Sugestões de times")
        print(f"   • GET /api/v1/market/status - Status do mercado")
        print(f"   • GET /api/v1/etl/status - Status do ETL")
        print(f"   • GET /api/v1/analytics/dashboard - Dashboard")
        print(f"\n⚡ Pressione Ctrl+C para parar o servidor")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Servidor parado pelo usuário")
        httpd.server_close()
    except OSError as e:
        if "address already in use" in str(e).lower():
            new_port = find_free_port()
            print(f"⚠️  Porta {port} ocupada, tentando porta {new_port}")
            run_server(new_port)
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")

if __name__ == "__main__":
    run_server()