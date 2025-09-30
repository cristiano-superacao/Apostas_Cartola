"""
SuperMittos ETL - Sistema de coleta e cruzamento de dados de futebol
Coleta dados do Cartola FC, FootyStats, SofaScore e sites de prováveis/parciais
"""

import requests
import time
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from rapidfuzz import fuzz
import unicodedata
import re
from sqlalchemy import create_engine, text
from playwright.sync_api import sync_playwright
import os
from dataclasses import dataclass

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ConfigETL:
    """Configurações do ETL"""
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///supermittos.db")
    footystats_api_key: str = os.getenv("FOOTYSTATS_API_KEY", "example")
    cartola_api_base: str = "https://api.cartola.globo.com"
    footystats_api_base: str = "https://api.footystats.org"
    sofascore_api_base: str = "https://api.sofascore.com/api/v1"
    user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    
    # URLs dos sites de prováveis/parciais
    provaveis_urls: Dict[str, str] = None
    
    def __post_init__(self):
        if self.provaveis_urls is None:
            self.provaveis_urls = {
                "provaveis_cartola": "https://www.provaveisescalacoes.com/cartola",
                "parciais_cartola": "https://www.parciaiscartola.com.br",
                "ge_cartola": "https://ge.globo.com/cartola-fc"
            }

class DataNormalizer:
    """Classe para normalização e matching de dados entre fontes"""
    
    @staticmethod
    def normalize_name(name: str) -> str:
        """Normaliza nomes para comparação"""
        if not name:
            return ""
        
        # Remove acentos
        normalized = unicodedata.normalize('NFKD', name)
        normalized = normalized.encode('ASCII', 'ignore').decode('utf-8')
        
        # Lowercase e remove caracteres especiais
        normalized = re.sub(r'[^a-z0-9\s]', '', normalized.lower())
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        return normalized
    
    @staticmethod
    def calculate_similarity(name1: str, name2: str) -> float:
        """Calcula similaridade entre dois nomes"""
        norm1 = DataNormalizer.normalize_name(name1)
        norm2 = DataNormalizer.normalize_name(name2)
        
        if not norm1 or not norm2:
            return 0.0
            
        return fuzz.token_sort_ratio(norm1, norm2)
    
    @staticmethod
    def find_best_match(target_name: str, candidates: List[Dict], 
                       name_field: str = 'name', threshold: float = 85.0) -> Optional[Dict]:
        """Encontra o melhor match em uma lista de candidatos"""
        best_match = None
        best_score = 0.0
        
        for candidate in candidates:
            candidate_name = candidate.get(name_field, '')
            score = DataNormalizer.calculate_similarity(target_name, candidate_name)
            
            if score > best_score and score >= threshold:
                best_score = score
                best_match = {**candidate, '_match_score': score}
        
        return best_match

class CartolaETL:
    """ETL para dados do Cartola FC"""
    
    def __init__(self, config: ConfigETL):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': config.user_agent})
    
    def get_market_status(self) -> Dict:
        """Obtém status do mercado (aberto/fechado)"""
        try:
            url = f"{self.config.cartola_api_base}/mercado/status"
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Erro ao obter status do mercado: {e}")
            return {}
    
    def get_players(self) -> Dict:
        """Obtém dados dos jogadores do mercado"""
        try:
            url = f"{self.config.cartola_api_base}/atletas/mercado"
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Erro ao obter jogadores do Cartola: {e}")
            return {}
    
    def get_partial_scores(self, round_id: int = None) -> Dict:
        """Obtém pontuações parciais da rodada"""
        try:
            if round_id:
                url = f"{self.config.cartola_api_base}/atletas/pontuados/{round_id}"
            else:
                url = f"{self.config.cartola_api_base}/atletas/pontuados"
            
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Erro ao obter parciais do Cartola: {e}")
            return {}
    
    def get_clubs(self) -> Dict:
        """Obtém dados dos clubes"""
        try:
            url = f"{self.config.cartola_api_base}/clubes"
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Erro ao obter clubes do Cartola: {e}")
            return {}

class FootyStatsETL:
    """ETL para dados do FootyStats"""
    
    def __init__(self, config: ConfigETL):
        self.config = config
        self.session = requests.Session()
    
    def get_league_players(self, league_id: int = 71) -> Dict:  # 71 = Brasileirão
        """Obtém dados dos jogadores de uma liga"""
        try:
            url = f"{self.config.footystats_api_base}/league-players"
            params = {
                'key': self.config.footystats_api_key,
                'league_id': league_id
            }
            
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            if response.headers.get('content-type', '').startswith('application/json'):
                return response.json()
            else:
                logger.warning("FootyStats retornou resposta não-JSON")
                return {}
                
        except Exception as e:
            logger.error(f"Erro ao obter jogadores do FootyStats: {e}")
            return {}
    
    def get_team_stats(self, team_id: int) -> Dict:
        """Obtém estatísticas de um time"""
        try:
            url = f"{self.config.footystats_api_base}/team-stats"
            params = {
                'key': self.config.footystats_api_key,
                'team_id': team_id
            }
            
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"Erro ao obter stats do time {team_id}: {e}")
            return {}

class SofaScoreETL:
    """ETL para dados do SofaScore (não-oficial)"""
    
    def __init__(self, config: ConfigETL):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': config.user_agent,
            'Accept': 'application/json',
            'Origin': 'https://www.sofascore.com'
        })
    
    def get_tournament_players(self, tournament_id: int = 325) -> Dict:  # 325 = Brasileirão
        """Obtém jogadores de um torneio"""
        try:
            url = f"{self.config.sofascore_api_base}/tournament/{tournament_id}/season/players"
            response = self.session.get(url, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"SofaScore retornou status {response.status_code}")
                return {}
                
        except Exception as e:
            logger.error(f"Erro ao obter jogadores do SofaScore: {e}")
            return {}

class ProvaveisETL:
    """ETL para sites de prováveis escalações usando Playwright"""
    
    def __init__(self, config: ConfigETL):
        self.config = config
    
    def scrape_provaveis_with_playwright(self, url: str) -> Dict:
        """Faz scraping de prováveis escalações usando Playwright"""
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                # Configura user agent
                page.set_extra_http_headers({
                    'User-Agent': self.config.user_agent
                })
                
                page.goto(url, timeout=30000)
                
                # Aguarda carregamento
                page.wait_for_timeout(3000)
                
                # Tenta capturar dados JSON da página
                try:
                    # Busca por variáveis JavaScript que contenham dados
                    js_data = page.evaluate("""
                        () => {
                            // Busca por variáveis comuns que contenham dados
                            const possibleVars = ['window.data', 'window.players', 'window.escalacoes'];
                            for (let varName of possibleVars) {
                                try {
                                    const data = eval(varName);
                                    if (data && typeof data === 'object') {
                                        return data;
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                            return null;
                        }
                    """)
                    
                    if js_data:
                        browser.close()
                        return {'success': True, 'data': js_data, 'source': url}
                
                except Exception as e:
                    logger.warning(f"Erro ao extrair JS data: {e}")
                
                # Fallback: extrai texto da página
                content = page.content()
                browser.close()
                
                return {'success': True, 'html': content, 'source': url}
                
        except Exception as e:
            logger.error(f"Erro no scraping com Playwright: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_all_provaveis(self) -> Dict:
        """Obtém prováveis de todas as fontes configuradas"""
        results = {}
        
        for source, url in self.config.provaveis_urls.items():
            logger.info(f"Coletando prováveis de {source}")
            results[source] = self.scrape_provaveis_with_playwright(url)
            time.sleep(2)  # Rate limiting
        
        return results

class SuperMittosETL:
    """Classe principal do ETL que orquestra todas as coletas"""
    
    def __init__(self, config: ConfigETL = None):
        self.config = config or ConfigETL()
        self.engine = create_engine(self.config.database_url, echo=False)
        
        # Inicializa ETLs específicos
        self.cartola = CartolaETL(self.config)
        self.footystats = FootyStatsETL(self.config)
        self.sofascore = SofaScoreETL(self.config)
        self.provaveis = ProvaveisETL(self.config)
        
        # Normalizer para matching
        self.normalizer = DataNormalizer()
    
    def collect_all_data(self) -> Dict[str, Any]:
        """Coleta dados de todas as fontes"""
        logger.info("Iniciando coleta de dados de todas as fontes")
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'cartola': {},
            'footystats': {},
            'sofascore': {},
            'provaveis': {}
        }
        
        # Cartola FC
        logger.info("Coletando dados do Cartola FC")
        results['cartola'] = {
            'market_status': self.cartola.get_market_status(),
            'players': self.cartola.get_players(),
            'partial_scores': self.cartola.get_partial_scores(),
            'clubs': self.cartola.get_clubs()
        }
        
        # FootyStats
        logger.info("Coletando dados do FootyStats")
        results['footystats'] = {
            'players': self.footystats.get_league_players()
        }
        
        # SofaScore
        logger.info("Coletando dados do SofaScore")
        results['sofascore'] = {
            'players': self.sofascore.get_tournament_players()
        }
        
        # Prováveis
        logger.info("Coletando prováveis escalações")
        results['provaveis'] = self.provaveis.get_all_provaveis()
        
        return results
    
    def merge_player_data(self, collected_data: Dict) -> List[Dict]:
        """Faz merge dos dados dos jogadores de todas as fontes"""
        logger.info("Iniciando merge dos dados dos jogadores")
        
        merged_players = []
        
        # Base: jogadores do Cartola
        cartola_players = collected_data['cartola'].get('players', {}).get('atletas', [])
        if not cartola_players:
            logger.warning("Nenhum jogador encontrado no Cartola")
            return merged_players
        
        # FootyStats players
        footystats_players = collected_data['footystats'].get('players', {}).get('data', [])
        
        # SofaScore players  
        sofascore_players = collected_data['sofascore'].get('players', {}).get('players', [])
        
        for cartola_player in cartola_players:
            if not isinstance(cartola_player, dict):
                continue
                
            player_data = {
                'source_id': 'cartola',
                'cartola_id': cartola_player.get('atleta_id'),
                'name': cartola_player.get('nome', cartola_player.get('apelido', '')),
                'club_id': cartola_player.get('clube_id'),
                'position': cartola_player.get('posicao_id'),
                'price': cartola_player.get('preco_num'),
                'avg_score': cartola_player.get('media_num'),
                'status': cartola_player.get('status_id'),
                'matches': []  # Para armazenar matches de outras fontes
            }
            
            # Busca match no FootyStats
            if footystats_players:
                footystats_match = self.normalizer.find_best_match(
                    player_data['name'], 
                    footystats_players,
                    'name'
                )
                if footystats_match:
                    player_data['matches'].append({
                        'source': 'footystats',
                        'data': footystats_match,
                        'confidence': footystats_match.get('_match_score', 0)
                    })
            
            # Busca match no SofaScore
            if sofascore_players:
                sofascore_match = self.normalizer.find_best_match(
                    player_data['name'],
                    sofascore_players,
                    'name'
                )
                if sofascore_match:
                    player_data['matches'].append({
                        'source': 'sofascore', 
                        'data': sofascore_match,
                        'confidence': sofascore_match.get('_match_score', 0)
                    })
            
            merged_players.append(player_data)
        
        logger.info(f"Merge concluído: {len(merged_players)} jogadores processados")
        return merged_players
    
    def save_to_database(self, merged_data: List[Dict]) -> bool:
        """Salva os dados mergidos no banco de dados"""
        try:
            with self.engine.connect() as conn:
                # Cria tabela se não existir
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS players_merged (
                        id SERIAL PRIMARY KEY,
                        cartola_id INTEGER,
                        name TEXT,
                        club_id INTEGER,
                        position INTEGER,
                        price REAL,
                        avg_score REAL,
                        status INTEGER,
                        matches_data JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                
                # Limpa dados antigos (opcional)
                conn.execute(text("DELETE FROM players_merged WHERE created_at < NOW() - INTERVAL '1 day'"))
                
                # Insere novos dados
                for player in merged_data:
                    conn.execute(text("""
                        INSERT INTO players_merged 
                        (cartola_id, name, club_id, position, price, avg_score, status, matches_data)
                        VALUES (:cartola_id, :name, :club_id, :position, :price, :avg_score, :status, :matches_data)
                    """), {
                        'cartola_id': player.get('cartola_id'),
                        'name': player.get('name'),
                        'club_id': player.get('club_id'),
                        'position': player.get('position'),
                        'price': player.get('price'),
                        'avg_score': player.get('avg_score'),
                        'status': player.get('status'),
                        'matches_data': json.dumps(player.get('matches', []))
                    })
                
                conn.commit()
                logger.info(f"Dados salvos no banco: {len(merged_data)} jogadores")
                return True
                
        except Exception as e:
            logger.error(f"Erro ao salvar no banco: {e}")
            return False
    
    def run_full_etl(self) -> Dict[str, Any]:
        """Executa o ETL completo"""
        logger.info("=== INICIANDO ETL COMPLETO DO SUPERMITTOS ===")
        
        start_time = datetime.now()
        
        try:
            # 1. Coleta dados
            collected_data = self.collect_all_data()
            
            # 2. Merge dos dados
            merged_players = self.merge_player_data(collected_data)
            
            # 3. Salva no banco
            saved_successfully = self.save_to_database(merged_players)
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            summary = {
                'success': True,
                'start_time': start_time.isoformat(),
                'end_time': end_time.isoformat(),
                'duration_seconds': duration,
                'players_processed': len(merged_players),
                'database_saved': saved_successfully,
                'sources_collected': {
                    'cartola': bool(collected_data['cartola']),
                    'footystats': bool(collected_data['footystats']),
                    'sofascore': bool(collected_data['sofascore']),
                    'provaveis': bool(collected_data['provaveis'])
                }
            }
            
            logger.info(f"ETL concluído com sucesso em {duration:.2f}s")
            return summary
            
        except Exception as e:
            logger.error(f"Erro no ETL: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

def main():
    """Função principal para execução standalone"""
    print("🚀 SuperMittos ETL - Iniciando coleta de dados")
    
    # Inicializa ETL
    etl = SuperMittosETL()
    
    # Executa ETL completo
    result = etl.run_full_etl()
    
    # Exibe resultado
    print("\n📊 Resultado do ETL:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    if result.get('success'):
        print(f"✅ ETL concluído com sucesso!")
        print(f"⏱️  Duração: {result.get('duration_seconds', 0):.2f}s")
        print(f"👥 Jogadores processados: {result.get('players_processed', 0)}")
    else:
        print(f"❌ ETL falhou: {result.get('error', 'Erro desconhecido')}")

if __name__ == "__main__":
    main()