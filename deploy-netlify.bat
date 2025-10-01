@echo off
echo 🚀 Iniciando deploy do SuperMittos para Netlify...

cd frontend

echo 📦 Instalando dependências...
npm install

echo 🔨 Fazendo build do projeto...
npm run build

if exist "dist" (
    echo ✅ Build concluído com sucesso!
    echo 📁 Arquivos gerados em: frontend/dist/
    echo.
    echo 📋 Próximos passos para deploy no Netlify:
    echo 1. Acesse: https://app.netlify.com/projects/supermittos
    echo 2. Clique em 'Deploy' ou arraste a pasta 'dist' para a área de deploy
    echo 3. Ou use o Netlify CLI: netlify deploy --prod --dir=dist
    echo.
    echo 🌐 Configurações recomendadas:
    echo - Build command: cd frontend ^&^& npm run build
    echo - Publish directory: frontend/dist
    echo - Node version: 18
) else (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

pause