# SuperMittos Deployment and Operation Guide

## 📋 Pré-requisitos

### Para desenvolvimento local:
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Git

### Para produção:
- VPS/Servidor com Ubuntu 20.04+ ou CentOS 8+
- Docker e Docker Compose
- Domínio configurado (opcional)
- Certificado SSL (Let's Encrypt recomendado)

## 🚀 Deploy Local (Desenvolvimento)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/supermittos.git
cd supermittos
```

### 2. Configure variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
playwright install chromium

# Configurar banco de dados
psql -U postgres -c "CREATE DATABASE supermittos;"
psql -U postgres -d supermittos -f ../database/schema.sql

# Executar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Acessar aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentação API: http://localhost:8000/docs

## 🐳 Deploy com Docker (Recomendado)

### 1. Preparar ambiente
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/supermittos.git
cd supermittos

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações de produção
```

### 2. Build e execução
```bash
# Build das imagens
docker-compose build

# Executar em background
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Verificar status dos serviços
docker-compose ps
```

### 3. Inicialização do banco
```bash
# O schema é aplicado automaticamente na primeira execução
# Para reset completo:
docker-compose down -v
docker-compose up -d
```

## 🌐 Deploy em Produção

### Opção 1: VPS/Servidor Dedicado

#### 1. Preparar servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Nginx (se não usar container)
sudo apt install nginx certbot python3-certbot-nginx
```

#### 2. Configurar SSL com Let's Encrypt
```bash
# Obter certificado
sudo certbot --nginx -d supermittos.com -d www.supermittos.com

# Verificar renovação automática
sudo certbot renew --dry-run
```

#### 3. Deploy da aplicação
```bash
# Clone e configure
git clone https://github.com/seu-usuario/supermittos.git
cd supermittos

# Configure .env para produção
cp .env.example .env
nano .env

# Execute
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Opção 2: Railway

#### 1. Preparar arquivos
```bash
# Criar railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

#### 2. Deploy
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

### Opção 3: Render

#### 1. Configurar render.yaml
```yaml
services:
  - type: web
    name: supermittos-backend
    env: python
    buildCommand: "pip install -r requirements.txt && playwright install chromium"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    
  - type: web
    name: supermittos-frontend
    env: static
    buildCommand: "npm install && npm run build"
    staticPublishPath: ./build
```

## 📊 Monitoramento e Manutenção

### Logs
```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Logs do sistema
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Health Checks
```bash
# Verificar saúde dos serviços
curl -f http://localhost:8000/health
curl -f http://localhost:3000/api/health

# Status do banco
docker-compose exec postgres pg_isready -U supermittos

# Status do Redis
docker-compose exec redis redis-cli ping
```

### Backup do Banco
```bash
# Backup manual
docker-compose exec postgres pg_dump -U supermittos supermittos > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -T postgres psql -U supermittos supermittos < backup.sql

# Backup automático (crontab)
0 2 * * * cd /path/to/supermittos && docker-compose exec postgres pg_dump -U supermittos supermittos > backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

### Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose build
docker-compose up -d

# Verificar se tudo está funcionando
docker-compose ps
curl -f http://localhost:8000/health
```

## 🔧 Configurações Avançadas

### Escalabilidade
```yaml
# docker-compose.override.yml para múltiplas instâncias
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
  
  nginx:
    depends_on:
      - backend
```

### Monitoring com Prometheus
```yaml
# Adicionar ao docker-compose.yml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Rate Limiting Avançado
```nginx
# Em nginx.conf
http {
    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=burst:10m rate=30r/s;
    
    server {
        location /api/v1/etl/ {
            limit_req zone=api burst=5 nodelay;
        }
        
        location /api/v1/players {
            limit_req zone=burst burst=20 nodelay;
        }
    }
}
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Verificar logs do banco
docker-compose logs postgres

# Testar conexão manual
docker-compose exec postgres psql -U supermittos -d supermittos -c "SELECT 1;"
```

#### 2. ETL falhando
```bash
# Verificar logs do backend
docker-compose logs backend

# Verificar se as API keys estão configuradas
docker-compose exec backend env | grep API_KEY

# Executar ETL manualmente
docker-compose exec backend python -c "from app.etl.supermittos_etl import SuperMittosETL; etl = SuperMittosETL(); print(etl.run_full_etl())"
```

#### 3. Frontend não carregando
```bash
# Verificar se backend está acessível
curl -f http://localhost:8000/health

# Verificar configuração de proxy
cat frontend/next.config.js

# Rebuild do frontend
docker-compose build frontend
docker-compose up -d frontend
```

#### 4. Performance lenta
```bash
# Verificar uso de recursos
docker stats

# Adicionar índices no banco
docker-compose exec postgres psql -U supermittos -d supermittos
supermittos=# EXPLAIN ANALYZE SELECT * FROM jogadores WHERE nome ILIKE '%gabriel%';

# Verificar cache Redis
docker-compose exec redis redis-cli info memory
```

## 📈 Otimizações de Performance

### 1. Cache Redis
- Configurar TTL apropriado para diferentes endpoints
- Implementar cache warming para dados críticos
- Usar cache distribuído em ambiente multi-instância

### 2. Banco de Dados
- Configurar connection pooling
- Otimizar queries com EXPLAIN ANALYZE
- Implementar particionamento para tabelas grandes

### 3. Frontend
- Implementar Service Workers para cache offline
- Otimizar imagens com Next.js Image
- Usar CDN para assets estáticos

### 4. ETL
- Paralelizar coletas de diferentes fontes
- Implementar retry logic com backoff exponencial
- Usar batching para inserções no banco

## 🔐 Segurança

### 1. Banco de Dados
- Usar usuários com privilégios mínimos
- Backup criptografado
- Conexões SSL em produção

### 2. API
- Rate limiting por IP e usuário
- Validação rigorosa de inputs
- Logs de auditoria

### 3. Infraestrutura
- Firewall configurado
- Updates automáticos de segurança
- Monitoramento de vulnerabilidades

---

Para mais informações, consulte a documentação completa ou abra uma issue no GitHub.