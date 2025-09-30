"""
SuperMittos - Serverless Backend Entry Point
Configurado para funcionar no Vercel com FastAPI
"""

import os
import sys
from pathlib import Path

# Configurar o path para importar módulos do backend
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Configurações para serverless
os.environ.setdefault("PYTHONPATH", str(backend_path))

# Importar a aplicação FastAPI
from app.main import app

# Configurações específicas para produção serverless
if os.getenv("VERCEL_ENV") == "production":
    # Configurações otimizadas para produção
    app.debug = False
    
# Exportar a aplicação para o Vercel
handler = app