# 🚀 Guia de Deploy SuperMittos - PostgreSQL/Supabase + Netlify

## 📋 Checklist de Deploy

### 1. Configurar Banco de Dados no Supabase

1. **Criar projeto no Supabase:**
   - Acesse: https://supabase.com/
   - Crie conta (GitHub/Google)
   - Novo projeto: nome "supermittos"
   - Região: South America (Brasil)
   - Senha do banco: (guarde!)

2. **Executar schema no Supabase:**
   - No painel, vá em "SQL Editor"
   - Cole o conteúdo do arquivo `supabase_complete_schema.sql`
   - Execute o script (botão Run)

3. **Copiar credenciais:**
   - Project Settings → Database
   - Copie: Host, Port, Database name, Username, Password

### 2. Configurar Backend Python

1. **Instalar dependências:**
   ```bash
   cd backend
   pip install -r requirements_supabase.txt
   ```

2. **Criar arquivo `.env`:**
   - Copie `.env.example` para `.env`
   - Preencha com dados do Supabase:
   ```
   DB_HOST=db.xxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=sua_senha_supabase
   ```

3. **Testar backend:**
   ```bash
   python supabase_server.py
   ```
   - Deve conectar ao Supabase ✅
   - Teste: http://localhost:8000

### 3. Deploy Backend (Opções)

**Opção A - Railway (Recomendado):**
1. Acesse railway.app
2. Conecte GitHub
3. Deploy do repositório
4. Configure variáveis de ambiente (.env)

**Opção B - Render:**
1. Acesse render.com
2. Conecte GitHub
3. Web Service → Python
4. Configure variáveis de ambiente

**Opção C - Heroku:**
1. Crie Procfile: `web: python backend/supabase_server.py`
2. Deploy no Heroku
3. Configure config vars

### 4. Deploy Frontend no Netlify

1. **No painel Netlify:**
   - Site Settings → Build & Deploy
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Node version: 18

2. **Variáveis de ambiente:**
   - Site Settings → Environment Variables
   - Adicione: `VITE_API_URL` = URL do seu backend

3. **Deploy:**
   - Conecte GitHub ou upload manual
   - Deploy automático a cada push

### 5. Configurações Finais

1. **CORS no backend:**
   - Adicione URL do Netlify em `ALLOWED_ORIGINS`

2. **SSL/HTTPS:**
   - Netlify: automático
   - Backend: configurar se necessário

3. **DNS (opcional):**
   - Configure domínio customizado

## 🔧 URLs Finais

- **Frontend:** https://seu-app.netlify.app
- **Backend:** https://seu-backend.railway.app (ou render/heroku)
- **Banco:** Supabase (gerenciado)

## 🐛 Troubleshooting

**Erro de conexão PostgreSQL:**
- Verifique credenciais no .env
- Teste conexão no Supabase SQL Editor

**Build fail no Netlify:**
- Verifique Node.js version (18+)
- Verifique comando de build

**CORS error:**
- Adicione URL Netlify em ALLOWED_ORIGINS
- Verifique headers CORS

## 📞 Suporte

Se precisar de ajuda:
1. Verifique logs do Netlify/Railway
2. Teste conexão banco local
3. Verifique variáveis de ambiente

## ✅ Resultado Final

Após seguir este guia:
- ✅ Frontend React no Netlify
- ✅ Backend Python na nuvem
- ✅ PostgreSQL no Supabase
- ✅ Integração completa funcionando