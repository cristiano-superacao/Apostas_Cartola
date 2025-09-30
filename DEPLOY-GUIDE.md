# SuperMittos - Guia de Deploy Cloud ☁️

Este guia detalha como configurar e fazer deploy do SuperMittos localmente e na nuvem usando banco de dados cloud.

## 🚀 Quick Start - Setup Local

### 1. Configuração Automática (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/supermittos.git
cd supermittos

# Execute o setup automático
npm run setup
# ou para Windows: setup.bat
# ou para Linux/Mac: ./setup.sh
```

### 2. Configuração Manual

#### Pré-requisitos
- Node.js 18+
- Python 3.9+
- Git

#### Backend Local
```bash
cd backend
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
playwright install chromium
```

#### Frontend Local
```bash
cd frontend
npm install
```

#### Configurar Variáveis
```bash
cp .env.example .env
# Edite .env com suas configurações
```

## 🌩️ Configuração de Banco na Nuvem

### Opção 1: Supabase (Recomendado)

1. **Criar projeto**: https://supabase.com/dashboard
2. **Obter URL**: `Project Settings > Database > Connection string`
3. **Aplicar schema**:
   ```sql
   -- Cole o conteúdo de database/schema.sql no SQL Editor
   ```
4. **Configurar .env**:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Opção 2: Railway

1. **Criar projeto**: https://railway.app/new
2. **Adicionar PostgreSQL**: `New > Database > PostgreSQL`
3. **Obter URL**: No dashboard do banco, copiar `DATABASE_URL`
4. **Aplicar schema**: Via Railway CLI ou pgAdmin

### Opção 3: Neon (Serverless)

1. **Criar projeto**: https://neon.tech/
2. **Obter connection string**: Dashboard > Connection Details
3. **Configurar**:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
   ```

### Cache Redis na Nuvem

#### Upstash (Recomendado para Vercel)
1. **Criar database**: https://upstash.com/
2. **Obter URL**: Dashboard > Connect
3. **Configurar**:
   ```bash
   REDIS_URL=redis://default:password@redis-xxx.upstash.io:6379
   ```

## 🚀 Deploy Frontend (Netlify)

### Configuração Netlify

1. **Conectar GitHub**: https://netlify.com/ > New site from Git
2. **Configurar build**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`
3. **Variáveis de ambiente**:
   ```bash
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
   NETLIFY=true
   ```

### Deploy via CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=.next
```

## 🔧 Deploy Backend (Vercel)

### Configuração Vercel

1. **Instalar CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login e configurar**:
   ```bash
   vercel login
   vercel --cwd . # na raiz do projeto
   ```

3. **Variáveis de ambiente** (vercel.com dashboard):
   ```bash
   DATABASE_URL=sua_url_do_banco_na_nuvem
   REDIS_URL=sua_url_do_redis_na_nuvem
   FOOTYSTATS_API_KEY=sua_chave
   JWT_SECRET=sua_chave_jwt_segura
   ENCRYPTION_KEY=sua_chave_criptografia
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 Deploy Backend Alternativo (Railway)

### Railway Backend
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Deploy
railway up
```

## 🤖 Deploy Automático com GitHub Actions

### 1. Configurar Secrets no GitHub

No seu repositório GitHub, vá em `Settings > Secrets and variables > Actions`:

#### Netlify Secrets
- `NETLIFY_AUTH_TOKEN`: Token da Netlify
- `NETLIFY_SITE_ID`: ID do site na Netlify
- `NETLIFY_STAGING_SITE_ID`: ID do site de staging

#### Vercel Secrets
- `VERCEL_TOKEN`: Token da Vercel
- `VERCEL_ORG_ID`: ID da organização
- `VERCEL_PROJECT_ID`: ID do projeto

#### URLs de API
- `PROD_API_URL`: URL da API em produção
- `STAGING_API_URL`: URL da API em staging

### 2. Workflow Automático

O projeto inclui workflows GitHub Actions que fazem deploy automático:

- **Push para `main`**: Deploy para produção
- **Push para `develop`**: Deploy para staging
- **Pull Requests**: Deploy preview

## 🧪 Testando Deploy Local

### 1. Com banco na nuvem
```bash
# Configure .env com URLs da nuvem
DATABASE_URL=postgresql://postgres:password@sua-url-nuvem
REDIS_URL=redis://password@sua-redis-nuvem

# Backend
cd backend
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
uvicorn app.main:app --reload

# Frontend (nova aba)
cd frontend
npm run dev
```

### 2. Teste de produção local
```bash
# Build frontend
cd frontend
npm run build
npm start

# Backend sem reload
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📊 Monitoramento

### Logs de Deploy
```bash
# Vercel
vercel logs

# Netlify
netlify logs

# Railway
railway logs
```

### Health Checks
- Frontend: https://seu-site.netlify.app
- Backend: https://seu-backend.vercel.app/health
- API Docs: https://seu-backend.vercel.app/docs

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de build no frontend
```bash
# Limpar cache
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Erro de conexão com banco
- Verificar se URL do banco está correta
- Verificar se IP do Vercel está na whitelist
- Testar conexão local primeiro

#### 3. Erro de permissões Vercel
```bash
# Re-fazer login
vercel logout
vercel login
```

#### 4. Timeout no build
- Aumentar timeout na configuração do provedor
- Otimizar imports no código
- Usar build local e upload

### Debug Local
```bash
# Verificar variáveis
cd backend
source venv/bin/activate
python -c "import os; print(os.getenv('DATABASE_URL'))"

# Testar conexão banco
python -c "
import psycopg2
conn = psycopg2.connect('sua_database_url')
print('Conexão OK!')
"
```

## 🚀 Comandos Úteis

```bash
# Setup completo
npm run setup

# Desenvolvimento local
npm run dev

# Build produção
npm run build

# Deploy manual
vercel --prod                    # Backend
netlify deploy --prod --dir=frontend/.next  # Frontend

# Logs
vercel logs
netlify logs

# Status
vercel ls
netlify status
```

## 📱 URLs de Acesso

Após deploy bem-sucedido:

- **Frontend**: https://supermittos.netlify.app
- **Backend**: https://supermittos.vercel.app
- **API Docs**: https://supermittos.vercel.app/docs
- **Health**: https://supermittos.vercel.app/health

---

💡 **Dica**: Sempre teste primeiro em ambiente de staging antes de fazer deploy para produção!