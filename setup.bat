@echo off
REM SuperMittos - Script de Setup Local para Windows
echo 🏆 SuperMittos - Configuração Local (Windows)
echo ==================================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js não está instalado
    echo Instale Node.js 18+ de: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python não está instalado
    echo Instale Python 3.9+ de: https://python.org/
    pause
    exit /b 1
)

echo [INFO] Dependências verificadas ✓

REM Configurar ambiente
echo [INFO] Configurando variáveis de ambiente...
if not exist ".env" (
    copy ".env.example" ".env"
    echo [INFO] Arquivo .env criado
    echo [WARN] IMPORTANTE: Edite o arquivo .env com suas configurações
) else (
    echo [INFO] Arquivo .env já existe ✓
)

REM Configurar backend
echo [INFO] Configurando backend...
cd backend

REM Criar virtual environment
if not exist "venv" (
    echo [INFO] Criando virtual environment...
    python -m venv venv
)

REM Ativar virtual environment
call venv\Scripts\activate.bat

REM Instalar dependências
echo [INFO] Instalando dependências Python...
pip install --upgrade pip
pip install -r requirements.txt

REM Instalar Playwright browsers
echo [INFO] Instalando browsers do Playwright...
playwright install chromium

echo [INFO] Backend configurado ✓
cd ..

REM Configurar frontend
echo [INFO] Configurando frontend...
cd frontend

REM Instalar dependências
echo [INFO] Instalando dependências Node.js...
npm install

echo [INFO] Frontend configurado ✓
cd ..

echo.
echo ✅ Configuração concluída!
echo.
echo Para executar o projeto:
echo   1. Backend:  cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Acessos:
echo   🌐 Frontend: http://localhost:3000
echo   🔧 API:      http://localhost:8000
echo   📚 Docs:     http://localhost:8000/docs
echo.

pause