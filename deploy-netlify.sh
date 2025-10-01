#!/bin/bash

# Script de Deploy Automático para Netlify
# Execute este script para fazer deploy do SuperMittos

echo "🚀 Iniciando deploy do SuperMittos para Netlify..."

# 1. Instalar dependências se necessário
echo "📦 Instalando dependências..."
cd frontend
npm install

# 2. Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# 3. Verificar se build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: frontend/dist/"
    echo ""
    echo "📋 Próximos passos para deploy no Netlify:"
    echo "1. Acesse: https://app.netlify.com/projects/supermittos"
    echo "2. Clique em 'Deploy' ou arraste a pasta 'dist' para a área de deploy"
    echo "3. Ou use o Netlify CLI: netlify deploy --prod --dir=dist"
    echo ""
    echo "🌐 Configurações recomendadas:"
    echo "- Build command: cd frontend && npm run build"
    echo "- Publish directory: frontend/dist"
    echo "- Node version: 18"
else
    echo "❌ Erro no build!"
    exit 1
fi