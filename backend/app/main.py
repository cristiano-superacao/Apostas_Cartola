"""
SuperMittos API - FastAPI backend for football analytics
"""

from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import os
import json
from contextlib import asynccontextmanager

# Importa nosso ETL
from etl.supermittos_etl import SuperMittosETL, ConfigETL

# ================================
# CONFIGURATION
# ================================

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/supermittos")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ================================
# MODELS (Pydantic)
# ================================

class PlayerResponse(BaseModel):
    id: str
    cartola_id: int
    name: str
    nickname: Optional[str] = None
    club_name: Optional[str] = None
    position_name: str
    position_abbrev: str
    current_price: Optional[float] = None
    avg_score: Optional[float] = None
    recent_form: Optional[float] = None
    consistency: Optional[float] = None
    prob_starter: Optional[float] = None
    active: bool = True

class PlayerStats(BaseModel):
    player_id: str
    round_number: int
    cartola_points: Optional[float] = None
    price: Optional[float] = None
    played: bool = False
    minutes: int = 0
    goals: int = 0
    assists: int = 0
    xg: Optional[float] = None
    xa: Optional[float] = None
    rating: Optional[float] = None

class TeamSuggestion(BaseModel):
    id: str
    round_number: int
    formation: str = "3-4-3"
    strategy: str = "balanced"
    expected_score: Optional[float] = None
    total_cost: Optional[float] = None
    expected_roi: Optional[float] = None
    created_at: datetime

class SuggestionPlayer(BaseModel):
    player_id: str
    player_name: str
    position: str
    expected_points: Optional[float] = None
    price: Optional[float] = None
    captain: bool = False
    vice_captain: bool = False

class TeamSuggestionDetail(TeamSuggestion):
    players: List[SuggestionPlayer]

class ETLStatus(BaseModel):
    is_running: bool
    last_execution: Optional[datetime] = None
    last_duration: Optional[float] = None
    status: str
    players_processed: int = 0
    success: bool = True
    error_message: Optional[str] = None

class MarketStatus(BaseModel):
    current_round: int
    market_open: bool
    season: str = "2024"
    last_updated: datetime

# ================================
# DATABASE DEPENDENCY
# ================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================================
# ETL MANAGEMENT
# ================================

etl_instance = None
etl_status = {
    "is_running": False,
    "last_execution": None,
    "last_duration": None,
    "status": "idle",
    "players_processed": 0,
    "success": True,
    "error_message": None
}

async def run_etl_background():
    """Executa ETL em background"""
    global etl_status, etl_instance
    
    try:
        etl_status["is_running"] = True
        etl_status["status"] = "running"
        etl_status["error_message"] = None
        
        if not etl_instance:
            etl_instance = SuperMittosETL()
        
        result = etl_instance.run_full_etl()
        
        etl_status.update({
            "is_running": False,
            "last_execution": datetime.now(),
            "last_duration": result.get("duration_seconds", 0),
            "status": "completed" if result.get("success") else "error",
            "players_processed": result.get("players_processed", 0),
            "success": result.get("success", False),
            "error_message": result.get("error") if not result.get("success") else None
        })
        
    except Exception as e:
        etl_status.update({
            "is_running": False,
            "status": "error", 
            "success": False,
            "error_message": str(e)
        })

# ================================
# LIFESPAN EVENTS
# ================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 SuperMittos API starting up...")
    yield
    # Shutdown
    print("🛑 SuperMittos API shutting down...")

# ================================
# FASTAPI APP
# ================================

app = FastAPI(
    title="SuperMittos API",
    description="API para análise de futebol e sugestões de times do Cartola FC",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# HEALTH CHECK
# ================================

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "SuperMittos API is running! ⚽",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", tags=["Health"])
async def health_check():
    try:
        # Testa conexão com o banco
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")

# ================================
# ETL ENDPOINTS
# ================================

@app.get("/api/v1/etl/status", response_model=ETLStatus, tags=["ETL"])
async def get_etl_status():
    """Obtém status atual do ETL"""
    return ETLStatus(**etl_status)

@app.post("/api/v1/etl/run", tags=["ETL"])
async def trigger_etl(background_tasks: BackgroundTasks):
    """Dispara execução do ETL em background"""
    if etl_status["is_running"]:
        raise HTTPException(status_code=409, detail="ETL já está em execução")
    
    background_tasks.add_task(run_etl_background)
    
    return {
        "message": "ETL iniciado em background",
        "status": "started",
        "timestamp": datetime.now().isoformat()
    }

# ================================
# PLAYER ENDPOINTS
# ================================

@app.get("/api/v1/players", response_model=List[PlayerResponse], tags=["Players"])
async def get_players(
    position: Optional[str] = Query(None, description="Filtrar por posição (GOL, LAT, ZAG, MEI, ATA)"),
    club_id: Optional[int] = Query(None, description="Filtrar por clube"),
    min_price: Optional[float] = Query(None, description="Preço mínimo"),
    max_price: Optional[float] = Query(None, description="Preço máximo"),
    limit: int = Query(100, description="Limite de resultados"),
    db = Depends(get_db)
):
    """Lista jogadores com filtros opcionais"""
    
    query = """
    SELECT * FROM vw_jogadores_completo 
    WHERE status_ativo = true
    """
    params = {}
    
    if position:
        query += " AND posicao_abrev = :position"
        params["position"] = position.upper()
    
    if club_id:
        query += " AND clube_id = :club_id"  
        params["club_id"] = club_id
    
    if min_price is not None:
        query += " AND preco_atual >= :min_price"
        params["min_price"] = min_price
        
    if max_price is not None:
        query += " AND preco_atual <= :max_price"
        params["max_price"] = max_price
    
    query += " ORDER BY media_pontos DESC NULLS LAST LIMIT :limit"
    params["limit"] = limit
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            players = []
            
            for row in result:
                players.append(PlayerResponse(
                    id=str(row.id),
                    cartola_id=row.jogador_id,
                    name=row.nome,
                    nickname=row.apelido,
                    club_name=row.clube_nome,
                    position_name=row.posicao_nome,
                    position_abbrev=row.posicao_abrev,
                    current_price=row.preco_atual,
                    avg_score=row.media_pontos,
                    recent_form=row.forma_recente,
                    consistency=row.consistencia,
                    prob_starter=row.prob_titular,
                    active=row.status_ativo
                ))
            
            return players
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar jogadores: {str(e)}")

@app.get("/api/v1/players/{player_id}", response_model=PlayerResponse, tags=["Players"])
async def get_player_detail(player_id: str):
    """Obtém detalhes de um jogador específico"""
    
    query = """
    SELECT * FROM vw_jogadores_completo 
    WHERE id = :player_id
    """
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query), {"player_id": player_id})
            row = result.first()
            
            if not row:
                raise HTTPException(status_code=404, detail="Jogador não encontrado")
            
            return PlayerResponse(
                id=str(row.id),
                cartola_id=row.jogador_id,
                name=row.nome,
                nickname=row.apelido,
                club_name=row.clube_nome,
                position_name=row.posicao_nome,
                position_abbrev=row.posicao_abrev,
                current_price=row.preco_atual,
                avg_score=row.media_pontos,
                recent_form=row.forma_recente,
                consistency=row.consistencia,
                prob_starter=row.prob_titular,
                active=row.status_ativo
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar jogador: {str(e)}")

@app.get("/api/v1/players/{player_id}/stats", response_model=List[PlayerStats], tags=["Players"])
async def get_player_stats(
    player_id: str,
    round_start: Optional[int] = Query(None, description="Rodada inicial"),
    round_end: Optional[int] = Query(None, description="Rodada final"),
    limit: int = Query(10, description="Limite de resultados")
):
    """Obtém estatísticas históricas de um jogador"""
    
    query = """
    SELECT 
        jogador_id as player_id,
        rodada as round_number,
        pontos_cartola as cartola_points,
        preco as price,
        jogou as played,
        minutos_jogados as minutes,
        gols,
        assistencias,
        xg,
        xa,
        rating
    FROM estatisticas_rodada 
    WHERE jogador_id = :player_id
    """
    params = {"player_id": player_id}
    
    if round_start:
        query += " AND rodada >= :round_start"
        params["round_start"] = round_start
        
    if round_end:
        query += " AND rodada <= :round_end"
        params["round_end"] = round_end
    
    query += " ORDER BY rodada DESC LIMIT :limit"
    params["limit"] = limit
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            stats = []
            
            for row in result:
                stats.append(PlayerStats(
                    player_id=str(row.player_id),
                    round_number=row.round_number,
                    cartola_points=row.cartola_points,
                    price=row.price,
                    played=row.played or False,
                    minutes=row.minutes or 0,
                    goals=row.gols or 0,
                    assists=row.assistencias or 0,
                    xg=row.xg,
                    xa=row.xa,
                    rating=row.rating
                ))
            
            return stats
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar estatísticas: {str(e)}")

# ================================
# MARKET ENDPOINTS  
# ================================

@app.get("/api/v1/market/status", response_model=MarketStatus, tags=["Market"])
async def get_market_status():
    """Obtém status atual do mercado"""
    
    query = "SELECT * FROM mercado_status ORDER BY created_at DESC LIMIT 1"
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query))
            row = result.first()
            
            if not row:
                # Retorna status padrão se não encontrar
                return MarketStatus(
                    current_round=1,
                    market_open=False,
                    season="2024",
                    last_updated=datetime.now()
                )
            
            return MarketStatus(
                current_round=row.rodada_atual or 1,
                market_open=row.mercado_aberto or False,
                season=row.temporada or "2024",
                last_updated=row.created_at
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar status do mercado: {str(e)}")

# ================================
# SUGGESTIONS ENDPOINTS
# ================================

@app.get("/api/v1/suggestions", response_model=List[TeamSuggestion], tags=["Suggestions"])
async def get_team_suggestions(
    round_number: Optional[int] = Query(None, description="Rodada específica"),
    strategy: Optional[str] = Query(None, description="Estratégia (conservative, balanced, aggressive)"),
    limit: int = Query(10, description="Limite de resultados")
):
    """Lista sugestões de times"""
    
    query = """
    SELECT 
        id,
        rodada as round_number,
        esquema_tatico as formation,
        estrategia as strategy,
        pontuacao_esperada as expected_score,
        custo_total as total_cost,
        roi_esperado as expected_roi,
        created_at
    FROM sugestoes_times
    WHERE 1=1
    """
    params = {}
    
    if round_number:
        query += " AND rodada = :round_number"
        params["round_number"] = round_number
        
    if strategy:
        query += " AND estrategia = :strategy"
        params["strategy"] = strategy
    
    query += " ORDER BY pontuacao_esperada DESC NULLS LAST LIMIT :limit"
    params["limit"] = limit
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            suggestions = []
            
            for row in result:
                suggestions.append(TeamSuggestion(
                    id=str(row.id),
                    round_number=row.round_number,
                    formation=row.formation or "3-4-3",
                    strategy=row.strategy or "balanced",
                    expected_score=row.expected_score,
                    total_cost=row.total_cost,
                    expected_roi=row.expected_roi,
                    created_at=row.created_at
                ))
            
            return suggestions
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar sugestões: {str(e)}")

@app.get("/api/v1/suggestions/{suggestion_id}", response_model=TeamSuggestionDetail, tags=["Suggestions"])
async def get_suggestion_detail(suggestion_id: str):
    """Obtém detalhes de uma sugestão específica incluindo jogadores"""
    
    # Busca sugestão
    suggestion_query = """
    SELECT 
        id,
        rodada as round_number,
        esquema_tatico as formation,
        estrategia as strategy,
        pontuacao_esperada as expected_score,
        custo_total as total_cost,
        roi_esperado as expected_roi,
        created_at
    FROM sugestoes_times
    WHERE id = :suggestion_id
    """
    
    # Busca jogadores da sugestão
    players_query = """
    SELECT 
        sj.jogador_id as player_id,
        j.nome as player_name,
        sj.posicao_time as position,
        sj.pontos_esperados as expected_points,
        sj.preco as price,
        sj.capitao as captain,
        sj.vice_capitao as vice_captain
    FROM sugestoes_jogadores sj
    JOIN jogadores j ON sj.jogador_id = j.id
    WHERE sj.sugestao_id = :suggestion_id
    ORDER BY 
        CASE sj.posicao_time 
            WHEN 'GOL' THEN 1
            WHEN 'DEF' THEN 2 
            WHEN 'MID' THEN 3
            WHEN 'ATA' THEN 4
            ELSE 5
        END
    """
    
    try:
        with engine.connect() as conn:
            # Busca sugestão
            result = conn.execute(text(suggestion_query), {"suggestion_id": suggestion_id})
            suggestion_row = result.first()
            
            if not suggestion_row:
                raise HTTPException(status_code=404, detail="Sugestão não encontrada")
            
            # Busca jogadores
            players_result = conn.execute(text(players_query), {"suggestion_id": suggestion_id})
            players = []
            
            for player_row in players_result:
                players.append(SuggestionPlayer(
                    player_id=str(player_row.player_id),
                    player_name=player_row.player_name,
                    position=player_row.position,
                    expected_points=player_row.expected_points,
                    price=player_row.price,
                    captain=player_row.captain or False,
                    vice_captain=player_row.vice_captain or False
                ))
            
            return TeamSuggestionDetail(
                id=str(suggestion_row.id),
                round_number=suggestion_row.round_number,
                formation=suggestion_row.formation or "3-4-3",
                strategy=suggestion_row.strategy or "balanced",
                expected_score=suggestion_row.expected_score,
                total_cost=suggestion_row.total_cost,
                expected_roi=suggestion_row.expected_roi,
                created_at=suggestion_row.created_at,
                players=players
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar detalhes da sugestão: {str(e)}")

# ================================
# ANALYTICS ENDPOINTS
# ================================

@app.get("/api/v1/analytics/top-performers", tags=["Analytics"])
async def get_top_performers(
    position: Optional[str] = Query(None),
    limit: int = Query(10),
    metric: str = Query("avg_score", description="Métrica (avg_score, recent_form, roi)")
):
    """Top performers por posição e métrica"""
    
    order_by_map = {
        "avg_score": "media_pontos",
        "recent_form": "forma_recente", 
        "roi": "(media_pontos / NULLIF(preco_atual, 0))"
    }
    
    if metric not in order_by_map:
        raise HTTPException(status_code=400, detail="Métrica inválida")
    
    query = f"""
    SELECT 
        nome,
        apelido,
        clube_nome,
        posicao_abrev,
        media_pontos,
        forma_recente,
        preco_atual,
        (media_pontos / NULLIF(preco_atual, 0)) as roi
    FROM vw_jogadores_completo 
    WHERE status_ativo = true 
      AND media_pontos IS NOT NULL
    """
    params = {}
    
    if position:
        query += " AND posicao_abrev = :position"
        params["position"] = position.upper()
    
    query += f" ORDER BY {order_by_map[metric]} DESC NULLS LAST LIMIT :limit"
    params["limit"] = limit
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            performers = []
            
            for row in result:
                performers.append({
                    "name": row.nome,
                    "nickname": row.apelido,
                    "club": row.clube_nome,
                    "position": row.posicao_abrev,
                    "avg_score": row.media_pontos,
                    "recent_form": row.forma_recente,
                    "current_price": row.preco_atual,
                    "roi": round(row.roi, 4) if row.roi else None
                })
            
            return {
                "metric": metric,
                "position_filter": position,
                "performers": performers
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar top performers: {str(e)}")

@app.get("/api/v1/analytics/dashboard", tags=["Analytics"])
async def get_dashboard_data():
    """Dados para dashboard principal"""
    
    queries = {
        "total_players": "SELECT COUNT(*) as count FROM jogadores WHERE status_ativo = true",
        "market_stats": """
            SELECT 
                AVG(preco_atual) as avg_price,
                MIN(preco_atual) as min_price,
                MAX(preco_atual) as max_price
            FROM vw_jogadores_completo 
            WHERE preco_atual IS NOT NULL
        """,
        "position_distribution": """
            SELECT 
                posicao_abrev as position,
                COUNT(*) as count,
                AVG(media_pontos) as avg_score
            FROM vw_jogadores_completo 
            WHERE status_ativo = true
            GROUP BY posicao_abrev
            ORDER BY position
        """
    }
    
    try:
        with engine.connect() as conn:
            dashboard_data = {}
            
            # Total players
            result = conn.execute(text(queries["total_players"]))
            dashboard_data["total_players"] = result.scalar()
            
            # Market stats
            result = conn.execute(text(queries["market_stats"]))
            row = result.first()
            dashboard_data["market_stats"] = {
                "avg_price": round(row.avg_price, 2) if row.avg_price else 0,
                "min_price": row.min_price or 0,
                "max_price": row.max_price or 0
            }
            
            # Position distribution
            result = conn.execute(text(queries["position_distribution"]))
            dashboard_data["position_distribution"] = []
            for row in result:
                dashboard_data["position_distribution"].append({
                    "position": row.position,
                    "count": row.count,
                    "avg_score": round(row.avg_score, 2) if row.avg_score else 0
                })
            
            dashboard_data["last_updated"] = datetime.now().isoformat()
            
            return dashboard_data
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados do dashboard: {str(e)}")

# ================================
# ERROR HANDLERS
# ================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint não encontrado", "detail": str(exc)}
    )

@app.exception_handler(500)  
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Erro interno do servidor", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )