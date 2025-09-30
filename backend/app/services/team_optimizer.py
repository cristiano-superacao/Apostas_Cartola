"""
SuperMittos Team Optimization Engine
Sistema avançado de otimização para montagem de times do Cartola FC
Utiliza programação linear inteira (ILP) e múltiplas estratégias
"""

import pulp
import numpy as np
import pandas as pd
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum
import logging
from datetime import datetime
import json
from sqlalchemy import create_engine, text
import os

logger = logging.getLogger(__name__)

class OptimizationStrategy(Enum):
    CONSERVATIVE = "conservative"  # Foco em consistência e baixo risco
    BALANCED = "balanced"         # Equilibrio entre risco e retorno
    AGGRESSIVE = "aggressive"     # Alto risco, alto retorno

class Formation(Enum):
    F_3_4_3 = "3-4-3"
    F_3_5_2 = "3-5-2" 
    F_4_3_3 = "4-3-3"
    F_4_4_2 = "4-4-2"
    F_5_3_2 = "5-3-2"

@dataclass 
class PlayerData:
    """Dados de um jogador para otimização"""
    id: str
    cartola_id: int
    name: str
    position: str  # GOL, LAT, ZAG, MEI, ATA
    club_id: int
    price: float
    expected_points: float
    variance: float  # Variância das pontuações (risco)
    prob_starter: float  # Probabilidade de ser titular (0-1)
    recent_form: float  # Forma recente
    consistency: float  # Consistência (menor = mais consistente)
    roi: float  # Return on Investment
    
    # Flags especiais
    injured: bool = False
    suspended: bool = False
    
    def __post_init__(self):
        # Garantir que probabilidades estejam entre 0 e 1
        self.prob_starter = max(0, min(1, self.prob_starter))

@dataclass
class OptimizationConstraints:
    """Restrições para otimização do time"""
    budget: float = 100.0
    formation: Formation = Formation.F_3_4_3
    max_players_per_club: int = 3
    min_prob_starter: float = 0.6  # Mínimo de probabilidade de ser titular
    
    # Restrições por posição (baseado na formação)
    positions: Dict[str, Tuple[int, int]] = None  # (min, max)
    
    def __post_init__(self):
        if self.positions is None:
            self.positions = self._get_formation_constraints()
    
    def _get_formation_constraints(self) -> Dict[str, Tuple[int, int]]:
        """Define constraints por formação"""
        formations_map = {
            Formation.F_3_4_3: {
                "GOL": (1, 1),
                "ZAG": (3, 3), 
                "LAT": (0, 2),
                "MEI": (4, 4),
                "ATA": (3, 3)
            },
            Formation.F_3_5_2: {
                "GOL": (1, 1),
                "ZAG": (3, 3),
                "LAT": (0, 2), 
                "MEI": (5, 5),
                "ATA": (2, 2)
            },
            Formation.F_4_3_3: {
                "GOL": (1, 1),
                "ZAG": (2, 2),
                "LAT": (2, 2),
                "MEI": (3, 3),
                "ATA": (3, 3)
            },
            Formation.F_4_4_2: {
                "GOL": (1, 1),
                "ZAG": (2, 2),
                "LAT": (2, 2),
                "MEI": (4, 4),
                "ATA": (2, 2)
            },
            Formation.F_5_3_2: {
                "GOL": (1, 1),
                "ZAG": (3, 3),
                "LAT": (2, 2),
                "MEI": (3, 3),
                "ATA": (2, 2)
            }
        }
        return formations_map.get(self.formation, formations_map[Formation.F_3_4_3])

class PointsPredictor:
    """Preditor de pontos esperados baseado em múltiplas métricas"""
    
    def __init__(self, strategy: OptimizationStrategy):
        self.strategy = strategy
        
        # Pesos para diferentes métricas baseado na estratégia
        self.weights = self._get_strategy_weights()
    
    def _get_strategy_weights(self) -> Dict[str, float]:
        """Define pesos das métricas por estratégia"""
        if self.strategy == OptimizationStrategy.CONSERVATIVE:
            return {
                "avg_score": 0.4,       # Histórico é importante
                "recent_form": 0.2,     # Forma recente moderada
                "consistency": 0.3,     # Alta importância à consistência
                "prob_starter": 0.1     # Probabilidade de jogar
            }
        elif self.strategy == OptimizationStrategy.AGGRESSIVE:
            return {
                "avg_score": 0.2,       # Menos foco no histórico
                "recent_form": 0.5,     # Muito foco na forma atual  
                "consistency": 0.1,     # Pouco foco na consistência
                "prob_starter": 0.2     # Jogadores em alta
            }
        else:  # BALANCED
            return {
                "avg_score": 0.35,
                "recent_form": 0.35,
                "consistency": 0.2,
                "prob_starter": 0.1
            }
    
    def calculate_expected_points(self, 
                                avg_score: float,
                                recent_form: float, 
                                consistency: float,
                                prob_starter: float) -> float:
        """Calcula pontos esperados usando pesos da estratégia"""
        
        # Normaliza consistência (menor é melhor, então inverte)
        consistency_normalized = max(0, 10 - consistency) / 10
        
        expected = (
            self.weights["avg_score"] * (avg_score or 0) +
            self.weights["recent_form"] * (recent_form or 0) +
            self.weights["consistency"] * consistency_normalized +
            self.weights["prob_starter"] * prob_starter * 15  # Bonus por probabilidade
        )
        
        return max(0, expected)

class TeamOptimizer:
    """Otimizador principal usando programação linear inteira"""
    
    def __init__(self, strategy: OptimizationStrategy = OptimizationStrategy.BALANCED):
        self.strategy = strategy
        self.predictor = PointsPredictor(strategy)
        
    def optimize_team(self, 
                     players: List[PlayerData],
                     constraints: OptimizationConstraints) -> Dict[str, Any]:
        """
        Otimiza time usando programação linear inteira
        """
        logger.info(f"Iniciando otimização com estratégia {self.strategy.value}")
        
        if not players:
            raise ValueError("Lista de jogadores não pode ser vazia")
        
        # Filtra jogadores elegíveis
        eligible_players = self._filter_eligible_players(players, constraints)
        
        if len(eligible_players) < 11:
            raise ValueError(f"Poucos jogadores elegíveis: {len(eligible_players)}")
        
        # Cria problema de otimização
        prob = pulp.LpProblem("SuperMittos_Team_Optimization", pulp.LpMaximize)
        
        # Variáveis de decisão (binária para cada jogador)
        player_vars = {
            player.id: pulp.LpVariable(f"player_{player.id}", cat='Binary')
            for player in eligible_players
        }
        
        # Função objetivo: maximizar pontos esperados
        prob += pulp.lpSum([
            player_vars[player.id] * self._calculate_adjusted_points(player)
            for player in eligible_players
        ])
        
        # Restrições
        self._add_constraints(prob, eligible_players, player_vars, constraints)
        
        # Resolve o problema
        prob.solve(pulp.PULP_CBC_CMD(msg=0))
        
        # Processa resultado
        if prob.status != pulp.LpStatusOptimal:
            raise Exception(f"Otimização falhou com status: {pulp.LpStatus[prob.status]}")
        
        return self._extract_solution(eligible_players, player_vars, constraints)
    
    def _filter_eligible_players(self, 
                                players: List[PlayerData],
                                constraints: OptimizationConstraints) -> List[PlayerData]:
        """Filtra jogadores elegíveis"""
        eligible = []
        
        for player in players:
            # Filtros básicos
            if (player.injured or 
                player.suspended or
                player.price <= 0 or
                player.prob_starter < constraints.min_prob_starter):
                continue
                
            # Calcula pontos esperados
            player.expected_points = self.predictor.calculate_expected_points(
                avg_score=getattr(player, 'avg_score', 0),
                recent_form=player.recent_form,
                consistency=player.consistency,
                prob_starter=player.prob_starter
            )
            
            # Calcula ROI ajustado
            player.roi = player.expected_points / player.price if player.price > 0 else 0
            
            eligible.append(player)
        
        logger.info(f"Jogadores elegíveis: {len(eligible)} de {len(players)}")
        return eligible
    
    def _calculate_adjusted_points(self, player: PlayerData) -> float:
        """Calcula pontos ajustados pela estratégia"""
        base_points = player.expected_points
        
        # Ajustes por estratégia
        if self.strategy == OptimizationStrategy.CONSERVATIVE:
            # Penaliza alta variância
            risk_penalty = player.variance * 0.1 if hasattr(player, 'variance') else 0
            return base_points - risk_penalty
            
        elif self.strategy == OptimizationStrategy.AGGRESSIVE:
            # Bonus para jogadores em alta forma
            form_bonus = max(0, player.recent_form - 10) * 0.2
            return base_points + form_bonus
            
        else:  # BALANCED
            return base_points
    
    def _add_constraints(self, 
                        prob,
                        players: List[PlayerData],
                        player_vars: Dict[str, pulp.LpVariable],
                        constraints: OptimizationConstraints):
        """Adiciona todas as restrições ao problema"""
        
        # 1. Restrição orçamentária
        prob += pulp.lpSum([
            player_vars[p.id] * p.price for p in players
        ]) <= constraints.budget
        
        # 2. Exatamente 11 jogadores
        prob += pulp.lpSum([player_vars[p.id] for p in players]) == 11
        
        # 3. Restrições por posição
        for position, (min_count, max_count) in constraints.positions.items():
            position_players = [p for p in players if p.position == position]
            
            if position_players:
                position_sum = pulp.lpSum([player_vars[p.id] for p in position_players])
                prob += position_sum >= min_count
                prob += position_sum <= max_count
        
        # 4. Máximo de jogadores por clube
        clubs = set(p.club_id for p in players)
        for club_id in clubs:
            club_players = [p for p in players if p.club_id == club_id]
            if len(club_players) > constraints.max_players_per_club:
                prob += pulp.lpSum([
                    player_vars[p.id] for p in club_players
                ]) <= constraints.max_players_per_club
        
        # 5. Pelo menos um jogador de cada linha
        defenders = [p for p in players if p.position in ['ZAG', 'LAT']]
        midfielders = [p for p in players if p.position == 'MEI']
        attackers = [p for p in players if p.position == 'ATA']
        
        if defenders:
            prob += pulp.lpSum([player_vars[p.id] for p in defenders]) >= 1
        if midfielders:
            prob += pulp.lpSum([player_vars[p.id] for p in midfielders]) >= 1
        if attackers:
            prob += pulp.lpSum([player_vars[p.id] for p in attackers]) >= 1
    
    def _extract_solution(self, 
                         players: List[PlayerData],
                         player_vars: Dict[str, pulp.LpVariable],
                         constraints: OptimizationConstraints) -> Dict[str, Any]:
        """Extrai solução do problema resolvido"""
        
        selected_players = []
        total_cost = 0
        total_expected = 0
        
        for player in players:
            if player_vars[player.id].varValue == 1:
                selected_players.append(player)
                total_cost += player.price
                total_expected += player.expected_points
        
        # Ordena por posição e pontos esperados
        selected_players.sort(key=lambda p: (
            ['GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].index(p.position),
            -p.expected_points
        ))
        
        # Seleciona capitão e vice (maiores pontuações esperadas)
        sorted_by_points = sorted(selected_players, key=lambda p: p.expected_points, reverse=True)
        captain = sorted_by_points[0] if sorted_by_points else None
        vice_captain = sorted_by_points[1] if len(sorted_by_points) > 1 else None
        
        # Calcula métricas
        expected_roi = total_expected / total_cost if total_cost > 0 else 0
        avg_prob_starter = np.mean([p.prob_starter for p in selected_players])
        
        return {
            "success": True,
            "strategy": self.strategy.value,
            "formation": constraints.formation.value,
            "players": [
                {
                    "id": p.id,
                    "cartola_id": p.cartola_id,
                    "name": p.name,
                    "position": p.position,
                    "club_id": p.club_id,
                    "price": p.price,
                    "expected_points": round(p.expected_points, 2),
                    "prob_starter": p.prob_starter,
                    "roi": round(p.roi, 4),
                    "is_captain": p.id == captain.id if captain else False,
                    "is_vice_captain": p.id == vice_captain.id if vice_captain else False
                }
                for p in selected_players
            ],
            "metrics": {
                "total_cost": round(total_cost, 2),
                "budget_remaining": round(constraints.budget - total_cost, 2),
                "total_expected_points": round(total_expected, 2),
                "expected_roi": round(expected_roi, 4),
                "avg_prob_starter": round(avg_prob_starter, 3),
                "position_distribution": self._get_position_distribution(selected_players)
            },
            "constraints_used": {
                "budget": constraints.budget,
                "formation": constraints.formation.value,
                "max_per_club": constraints.max_players_per_club,
                "min_prob_starter": constraints.min_prob_starter
            },
            "created_at": datetime.now().isoformat()
        }
    
    def _get_position_distribution(self, players: List[PlayerData]) -> Dict[str, int]:
        """Calcula distribuição por posição"""
        distribution = {}
        for player in players:
            distribution[player.position] = distribution.get(player.position, 0) + 1
        return distribution

class SuperMittosOptimizationEngine:
    """Engine principal de otimização do SuperMittos"""
    
    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.getenv("DATABASE_URL")
        self.engine = create_engine(self.database_url) if self.database_url else None
    
    def load_players_from_db(self, round_number: Optional[int] = None) -> List[PlayerData]:
        """Carrega jogadores do banco de dados"""
        if not self.engine:
            raise ValueError("Database engine não configurado")
        
        query = """
        SELECT 
            j.id,
            j.jogador_id,
            j.nome,
            j.posicao_nome,
            j.clube_id,
            j.preco_atual as price,
            j.media_pontos as avg_score,
            j.forma_recente,
            j.consistencia,
            j.prob_titular,
            COALESCE(pe.lesionado, false) as injured,
            COALESCE(pe.suspenso, false) as suspended
        FROM vw_jogadores_completo j
        LEFT JOIN provaveis_escalacoes pe ON j.id = pe.jogador_id 
            AND pe.rodada = COALESCE(:round_number, (SELECT MAX(rodada_atual) FROM mercado_status))
        WHERE j.status_ativo = true
          AND j.preco_atual IS NOT NULL
          AND j.preco_atual > 0
        """
        
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(query), {"round_number": round_number})
                players = []
                
                for row in result:
                    # Mapeia posições do banco para posições do otimizador
                    position_map = {
                        'Goleiro': 'GOL',
                        'Lateral': 'LAT', 
                        'Zagueiro': 'ZAG',
                        'Meia': 'MEI',
                        'Atacante': 'ATA'
                    }
                    
                    position = position_map.get(row.posicao_nome, 'MEI')
                    
                    player = PlayerData(
                        id=str(row.id),
                        cartola_id=row.jogador_id,
                        name=row.nome,
                        position=position,
                        club_id=row.clube_id or 0,
                        price=float(row.price or 0),
                        expected_points=0,  # Será calculado pelo predictor
                        variance=row.consistencia or 5,
                        prob_starter=(row.prob_titular or 50) / 100,  # Converte para 0-1
                        recent_form=row.forma_recente or 0,
                        consistency=row.consistencia or 5,
                        roi=0,  # Será calculado
                        injured=row.injured or False,
                        suspended=row.suspended or False
                    )
                    
                    # Adiciona avg_score como atributo extra
                    setattr(player, 'avg_score', row.avg_score or 0)
                    
                    players.append(player)
                
                logger.info(f"Carregados {len(players)} jogadores do banco")
                return players
                
        except Exception as e:
            logger.error(f"Erro ao carregar jogadores: {e}")
            raise
    
    def generate_team_suggestions(self,
                                round_number: Optional[int] = None,
                                strategies: List[OptimizationStrategy] = None,
                                formations: List[Formation] = None,
                                budgets: List[float] = None) -> List[Dict[str, Any]]:
        """Gera múltiplas sugestões com diferentes configurações"""
        
        if strategies is None:
            strategies = [OptimizationStrategy.CONSERVATIVE, 
                         OptimizationStrategy.BALANCED,
                         OptimizationStrategy.AGGRESSIVE]
        
        if formations is None:
            formations = [Formation.F_3_4_3, Formation.F_4_3_3]
        
        if budgets is None:
            budgets = [100.0]
        
        # Carrega jogadores
        players = self.load_players_from_db(round_number)
        
        suggestions = []
        
        for strategy in strategies:
            optimizer = TeamOptimizer(strategy)
            
            for formation in formations:
                for budget in budgets:
                    try:
                        constraints = OptimizationConstraints(
                            budget=budget,
                            formation=formation,
                            max_players_per_club=3,
                            min_prob_starter=0.5
                        )
                        
                        result = optimizer.optimize_team(players, constraints)
                        
                        if result["success"]:
                            suggestions.append(result)
                            logger.info(f"Sugestão gerada: {strategy.value} + {formation.value}")
                        
                    except Exception as e:
                        logger.warning(f"Falha na otimização {strategy.value} + {formation.value}: {e}")
                        continue
        
        # Ordena por pontuação esperada
        suggestions.sort(key=lambda x: x["metrics"]["total_expected_points"], reverse=True)
        
        return suggestions
    
    def save_suggestions_to_db(self, 
                              suggestions: List[Dict[str, Any]], 
                              round_number: int) -> bool:
        """Salva sugestões no banco de dados"""
        if not self.engine:
            return False
        
        try:
            with self.engine.connect() as conn:
                for suggestion in suggestions:
                    # Insere sugestão principal
                    suggestion_id = self._insert_suggestion(conn, suggestion, round_number)
                    
                    # Insere jogadores da sugestão
                    self._insert_suggestion_players(conn, suggestion_id, suggestion["players"])
                
                conn.commit()
                logger.info(f"Salvas {len(suggestions)} sugestões no banco")
                return True
                
        except Exception as e:
            logger.error(f"Erro ao salvar sugestões: {e}")
            return False
    
    def _insert_suggestion(self, conn, suggestion: Dict, round_number: int) -> str:
        """Insere sugestão principal"""
        query = """
        INSERT INTO sugestoes_times 
        (rodada, orcamento_maximo, estrategia, esquema_tatico, pontuacao_esperada, 
         custo_total, roi_esperado, algoritmo_versao, parametros)
        VALUES (:rodada, :orcamento, :estrategia, :esquema, :pontuacao, :custo, :roi, :versao, :params)
        RETURNING id
        """
        
        result = conn.execute(text(query), {
            "rodada": round_number,
            "orcamento": suggestion["constraints_used"]["budget"],
            "estrategia": suggestion["strategy"],
            "esquema": suggestion["formation"],
            "pontuacao": suggestion["metrics"]["total_expected_points"],
            "custo": suggestion["metrics"]["total_cost"],
            "roi": suggestion["metrics"]["expected_roi"],
            "versao": "1.0",
            "params": json.dumps(suggestion["constraints_used"])
        })
        
        return str(result.scalar())
    
    def _insert_suggestion_players(self, conn, suggestion_id: str, players: List[Dict]):
        """Insere jogadores da sugestão"""
        for player in players:
            query = """
            INSERT INTO sugestoes_jogadores
            (sugestao_id, jogador_id, posicao_time, capitao, vice_capitao, 
             pontos_esperados, preco, roi_individual)
            VALUES (:sugestao_id, :jogador_id, :posicao, :capitao, :vice, 
                    :pontos, :preco, :roi)
            """
            
            conn.execute(text(query), {
                "sugestao_id": suggestion_id,
                "jogador_id": player["id"],
                "posicao": player["position"],
                "capitao": player["is_captain"],
                "vice": player["is_vice_captain"],
                "pontos": player["expected_points"],
                "preco": player["price"],
                "roi": player["roi"]
            })

def main():
    """Função principal para testes"""
    print("🎯 SuperMittos Team Optimizer")
    
    try:
        engine = SuperMittosOptimizationEngine()
        
        # Gera sugestões
        suggestions = engine.generate_team_suggestions(
            strategies=[OptimizationStrategy.BALANCED],
            formations=[Formation.F_3_4_3]
        )
        
        print(f"✅ Geradas {len(suggestions)} sugestões")
        
        for i, suggestion in enumerate(suggestions[:2]):  # Mostra apenas as 2 melhores
            print(f"\n📊 Sugestão {i+1}:")
            print(f"Estratégia: {suggestion['strategy']}")
            print(f"Formação: {suggestion['formation']}")
            print(f"Custo: R$ {suggestion['metrics']['total_cost']}")
            print(f"Pontos esperados: {suggestion['metrics']['total_expected_points']}")
            print(f"ROI: {suggestion['metrics']['expected_roi']}")
            
            print("\n👥 Jogadores:")
            for player in suggestion["players"]:
                captain_flag = " (C)" if player["is_captain"] else " (VC)" if player["is_vice_captain"] else ""
                print(f"  {player['position']} - {player['name']}{captain_flag} - R$ {player['price']} - {player['expected_points']} pts")
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    main()