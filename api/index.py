"""
SuperMittos API - Vercel Serverless Adapter
"""

import os
import sys
from typing import Dict, Any

# Adiciona o diretório backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Importa a aplicação FastAPI do backend
try:
    from backend.app.main import app as fastapi_app
except ImportError:
    # Fallback para desenvolvimento local
    from app.main import app as fastapi_app

# Configura CORS para produção
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.vercel.app",
        "https://*.netlify.app", 
        "https://supermittos.com",
        "https://www.supermittos.com",
        "http://localhost:3000"  # desenvolvimento
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Adapter para Vercel (usando Mangum)
handler = Mangum(fastapi_app)

def lambda_handler(event: Dict[str, Any], context: Any):
    """Handler para AWS Lambda/Vercel"""
    return handler(event, context)