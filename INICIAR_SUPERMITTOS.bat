@echo off
echo ========================================
echo    🚀 SUPERMITTOS - INICIADOR RAPIDO
echo ========================================
echo.

echo 📁 Navegando para diretórios corretos...
echo.

echo 🖥️  Iniciando Backend (Porta 8000)...
start "SuperMittos Backend" cmd /k "cd /d c:\Users\bivol\Documents\GitHub\analise_fut\supermittos\backend && python simple_server.py"

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🌐 Iniciando Frontend (Porta 3000)...
start "SuperMittos Frontend" cmd /k "cd /d c:\Users\bivol\Documents\GitHub\analise_fut\supermittos\frontend && npm run dev"

echo.
echo ✅ Servidores iniciados!
echo.
echo 🌍 URLs disponíveis:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo.
echo 📋 Comandos executados:
echo    Backend:  python simple_server.py
echo    Frontend: npm run dev
echo.
echo ⚠️  Pressione qualquer tecla para abrir o navegador...
pause >nul

echo 🌐 Abrindo navegador...
start http://localhost:3000

echo.
echo 🎉 SuperMittos iniciado com sucesso!
echo    Feche esta janela quando terminar de usar.
echo.
pause

CREATE TABLE jogadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    posicao VARCHAR(50),
    time VARCHAR(100),
    preco NUMERIC,
    rating NUMERIC
);

CREATE TABLE ofertas (
    id SERIAL PRIMARY KEY,
    jogador_id INTEGER REFERENCES jogadores(id),
    valor NUMERIC,
    status VARCHAR(20)
);

-- Adicione outras tabelas conforme seu arquivo database/schema.sql