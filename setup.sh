#!/bin/bash

# SuperMittos - Script de Setup Local para Linux/Mac
echo "🏆 SuperMittos - Configuração Local"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependências
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        error "$1 não está instalado. Por favor, instale $1 primeiro."
        exit 1
    else
        log "$1 encontrado ✓"
    fi
}

# Verificar Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado"
        echo "Instale Node.js 18+ de: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js versão 18+ é necessário. Versão atual: $(node -v)"
        exit 1
    fi
    
    log "Node.js $(node -v) ✓"
}

# Verificar Python
check_python() {
    if ! command -v python3 &> /dev/null; then
        error "Python 3 não está instalado"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if ! python3 -c 'import sys; exit(0 if sys.version_info >= (3, 9) else 1)'; then
        error "Python 3.9+ é necessário. Versão atual: $PYTHON_VERSION"
        exit 1
    fi
    
    log "Python $PYTHON_VERSION ✓"
}

# Configurar backend
setup_backend() {
    log "Configurando backend..."
    
    cd backend
    
    # Criar virtual environment
    if [ ! -d "venv" ]; then
        log "Criando virtual environment..."
        python3 -m venv venv
    fi
    
    # Ativar virtual environment
    source venv/bin/activate
    
    # Instalar dependências
    log "Instalando dependências Python..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Instalar Playwright browsers
    log "Instalando browsers do Playwright..."
    playwright install chromium
    
    log "Backend configurado ✓"
    cd ..
}

# Configurar frontend
setup_frontend() {
    log "Configurando frontend..."
    
    cd frontend
    
    # Instalar dependências
    log "Instalando dependências Node.js..."
    npm install
    
    log "Frontend configurado ✓"
    cd ..
}

# Configurar banco de dados
setup_database() {
    log "Configurando banco de dados..."
    
    # Verificar se PostgreSQL está rodando
    if ! pg_isready -q 2>/dev/null; then
        warn "PostgreSQL não está rodando ou não está instalado"
        echo "Para instalar PostgreSQL:"
        echo "  - Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
        echo "  - macOS: brew install postgresql"
        echo "  - Ou use Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15"
        return
    fi
    
    # Criar banco se não existir
    log "Criando banco de dados supermittos..."
    createdb supermittos 2>/dev/null || warn "Banco supermittos já existe"
    
    # Aplicar schema
    log "Aplicando schema do banco..."
    psql -U postgres -d supermittos -f database/schema.sql
    
    log "Banco de dados configurado ✓"
}

# Configurar ambiente
setup_environment() {
    log "Configurando variáveis de ambiente..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log "Arquivo .env criado. Configure suas variáveis!"
        warn "IMPORTANTE: Edite o arquivo .env com suas configurações"
    else
        log "Arquivo .env já existe ✓"
    fi
}

# Menu principal
main() {
    echo -e "${BLUE}"
    cat << "EOF"
     ____                       __  __ _ _   _            
    / ___| _   _ _ __   ___ _ __|  \/  (_) |_| |_ ___  ___ 
    \___ \| | | | '_ \ / _ \ '__| |\/| | | __| __/ _ \/ __|
     ___) | |_| | |_) |  __/ |  | |  | | | |_| || (_) \__ \
    |____/ \__,_| .__/ \___|_|  |_|  |_|_|\__|\__\___/|___/
                |_|                                       
EOF
    echo -e "${NC}"
    
    log "Verificando dependências..."
    check_node
    check_python
    check_dependency "git"
    
    log "Iniciando configuração..."
    
    setup_environment
    setup_backend
    setup_frontend
    setup_database
    
    echo ""
    echo -e "${GREEN}✅ Configuração concluída!${NC}"
    echo ""
    echo "Para executar o projeto:"
    echo "  1. Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
    echo "  2. Frontend: cd frontend && npm run dev"
    echo ""
    echo "Acessos:"
    echo "  🌐 Frontend: http://localhost:3000"
    echo "  🔧 API:      http://localhost:8000"
    echo "  📚 Docs:     http://localhost:8000/docs"
    echo ""
}

# Executar apenas se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi