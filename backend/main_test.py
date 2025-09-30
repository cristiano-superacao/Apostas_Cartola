"""
SuperMittos API - Versão de teste simplificada
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import random

# Criar aplicação FastAPI
app = FastAPI(
    title="SuperMittos API",
    description="Plataforma de Análise Futebolística",
    version="1.0.0"
)

# Configurar CORS mais permissivo para desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mais permissivo para desenvolvimento
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "SuperMittos API is running! ⚽",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "simulated",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/players")
async def get_players():
    """Endpoint simulado de jogadores"""
    players = [
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
    ]
    
    return {
        "data": players,
        "total": len(players),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/suggestions")
async def get_suggestions():
    """Endpoint simulado de sugestões de time"""
    suggestions = [
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
        },
        {
            "id": "2", 
            "round_number": 38,
            "formation": "3-5-2",
            "strategy": "aggressive",
            "expected_score": 52.3,
            "total_cost": 100.0,
            "expected_roi": 0.523,
            "created_at": (datetime.now() - timedelta(hours=1)).isoformat(),
            "players": [
                {"player_name": "Bruno Henrique", "position": "ATA", "captain": True, "vice_captain": False},
                {"player_name": "Raphinha", "position": "MEI", "captain": False, "vice_captain": True}
            ]
        }
    ]
    
    return {
        "data": suggestions,
        "total": len(suggestions),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/market/status") 
async def get_market_status():
    """Status do mercado"""
    return {
        "data": {
            "current_round": 38,
            "market_open": True,
            "season": "2025",
            "last_updated": datetime.now().isoformat()
        }
    }

@app.get("/api/v1/etl/status")
async def get_etl_status():
    """Status do ETL"""
    return {
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

@app.get("/api/v1/analytics/dashboard")
async def get_dashboard():
    """Dashboard analytics"""
    return {
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)