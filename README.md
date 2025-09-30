# SuperMittos - Plataforma de Análise Futebolística 🏆

![SuperMittos Logo](https://img.shields.io/badge/SuperMittos-Football%20Analytics-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-red)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🎯 Visão Geral

SuperMittos é uma plataforma avançada de análise futebolística que coleta dados de múltiplas fontes, realiza análises inteligentes e gera sugestões otimizadas de times para Cartola FC e principais campeonatos mundiais.

### ✨ Funcionalidades Principais

- 🔄 **ETL Automatizado**: Coleta dados do Cartola FC, FootyStats, SofaScore e sites de prováveis escalações
- 🤖 **IA para Otimização**: Algoritmos de programação linear para criação de times ideais
- 📊 **Analytics Avançado**: Dashboards interativos com estatísticas detalhadas
- 🌐 **Interface Responsiva**: Frontend moderno em React/Next.js
- 🔗 **API Robusta**: Backend FastAPI com documentação automática
- ⚡ **Cache Inteligente**: Sistema Redis para performance otimizada

## 🏗️ Arquitetura

```
SuperMittos/
├── 🔧 Backend (Python/FastAPI)
│   ├── API REST completa
│   ├── Sistema ETL multi-source
│   ├── Engine de otimização (PuLP)
│   └── Modelos de dados inteligentes
│
├── 🎨 Frontend (Next.js/TypeScript)
│   ├── Dashboard interativo
│   ├── Visualizações em tempo real
│   ├── Interface responsiva
│   └── PWA ready
│
├── 🗄️ Database (PostgreSQL)
│   ├── Schema otimizado
│   ├── Índices inteligentes
│   ├── Views analíticas
│   └── Triggers automáticos
│
└── 🐳 Deploy (Docker)
    ├── Multi-container setup
    ├── Nginx reverse proxy
    ├── SSL/TLS ready
    └── Production optimized
```

## 🚀 Quick Start

### 💻 Desenvolvimento Local
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/supermittos.git
cd supermittos

# 2. Setup automático
npm run setup
# ou manualmente: setup.bat (Windows) / ./setup.sh (Linux/Mac)

# 3. Executar
npm run dev
```

### ☁️ Deploy na Nuvem
```bash
# 1. Configure banco na nuvem (Supabase/Railway/Neon)
# 2. Configure .env.production
# 3. Deploy automático via GitHub Actions
# ou manual:
vercel --prod        # Backend
netlify deploy --prod --dir=frontend/.next  # Frontend
```

### 🎯 Acessos
- 🌍 **Frontend**: http://localhost:3000 (local) | https://supermittos.netlify.app (prod)
- 🔧 **API**: http://localhost:8000 (local) | https://supermittos.vercel.app (prod) 
- 📚 **Docs**: http://localhost:8000/docs (local) | https://supermittos.vercel.app/docs (prod)

## 📚 Fontes de Dados

### 🎯 Cartola FC
- Mercado em tempo real
- Pontuações por rodada
- Status dos jogadores
- Probabilidade de escalação

### ⚽ FootyStats
- Estatísticas detalhadas de jogadores
- Dados históricos de performance
- Métricas avançadas (xG, xA)
- Comparações entre ligas

### 📱 SofaScore
- Dados em tempo real
- Ratings de performance
- Estatísticas de partidas
- Tendências de forma

### 🔮 Sites de Prováveis
- Escalações prováveis
- Status de lesões
- Notícias de times
- Atualizações de última hora

## 🤖 Sistema de Otimização

### Estratégias Disponíveis

#### 🛡️ Conservadora
- Foco em jogadores consistentes
- Baixo risco de lesão
- ROI estável

#### ⚖️ Balanceada
- Mix entre segurança e potencial
- Diversificação inteligente
- Risco moderado

#### 🚀 Agressiva
- Máximo potencial de pontuação
- Apostas em jogadores em alta
- Alto risco/alto retorno

### Algoritmos Utilizados
- **Programação Linear Inteira**: Otimização matemática para seleção ótima
- **Fuzzy Matching**: Correspondência inteligente entre diferentes fontes
- **Machine Learning**: Predição de performance baseada em histórico
- **Análise de Risco**: Avaliação probabilística de escalação

## 📊 Dashboard Analytics

### Métricas em Tempo Real
- 📈 Performance de jogadores
- 💰 Variação de preços do mercado
- 🎯 Sugestões personalizadas
- 📋 Status do ETL

### Visualizações Interativas
- Gráficos de tendência
- Mapas de calor de performance
- Comparações lado a lado
- Análise de ROI

## 🛠️ Desenvolvimento

### Setup Local
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
playwright install chromium
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Estrutura do Projeto
```
backend/
├── app/
│   ├── main.py           # FastAPI app principal
│   ├── api/              # Endpoints da API
│   ├── etl/              # Sistema ETL
│   ├── models/           # Modelos SQLAlchemy
│   └── services/         # Lógica de negócio
├── requirements.txt      # Dependências Python
└── Dockerfile           # Container backend

frontend/
├── src/
│   ├── app/             # App Router (Next.js 14)
│   ├── components/      # Componentes React
│   ├── hooks/           # Custom hooks
│   └── utils/           # Utilitários
├── package.json         # Dependências Node.js
└── Dockerfile          # Container frontend

database/
└── schema.sql          # Schema PostgreSQL

docker/
├── docker-compose.yml  # Orquestração
└── nginx.conf         # Configuração proxy
```

## 📊 Performance

### Benchmarks
- **ETL Full Cycle**: ~15 minutos para todas as fontes
- **API Response Time**: <100ms (95th percentile)
- **Optimization Algorithm**: <2s para gerar time ótimo
- **Database Queries**: <50ms (média)

### Otimizações Implementadas
- Connection pooling otimizado
- Cache multi-layer (Redis + Application)
- Lazy loading no frontend
- Compressão gzip/brotli
- Image optimization automática

## 🔐 Segurança

### Medidas Implementadas
- 🔒 Autenticação JWT
- 🛡️ Rate limiting por IP
- 🔐 Criptografia de dados sensíveis
- 🚫 Proteção contra CSRF/XSS
- 📝 Logs de auditoria
- 🔑 Gestão segura de secrets

## 🚀 Deploy e Produção

### Opções de Deploy

#### 🌐 Cloud (Recomendado)
- **Frontend**: Netlify (deploy estático otimizado)
- **Backend**: Vercel (serverless functions)
- **Banco**: Supabase/Railway/Neon (PostgreSQL na nuvem)
- **Cache**: Upstash Redis (serverless)

#### 🐳 Docker (VPS/Servidor)
```bash
docker-compose up -d
```

#### ☁️ Cloud Providers
- **Vercel**: Deploy automático via Git
- **Netlify**: Build estático otimizado
- **Railway**: Full-stack deployment
- **Render**: Container-based
- **AWS/Azure**: Enterprise ready

### Monitoramento
- Health checks automáticos
- GitHub Actions CI/CD
- Logs centralizados
- Métricas de performance

Para instruções detalhadas:
- 📚 **Deploy Local**: [DEPLOYMENT.md](DEPLOYMENT.md)
- ☁️ **Deploy Nuvem**: [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)

## 🤝 Contribuindo

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Documente mudanças significativas
- Use conventional commits

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Comunidade Cartola FC
- Desenvolvedores do FastAPI
- Time do Next.js
- Contribuidores open-source

## 📞 Suporte

- 📧 Email: suporte@supermittos.com
- 💬 Discord: [SuperMittos Community](https://discord.gg/supermittos)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/supermittos/issues)
- 📖 Docs: [Documentação Completa](https://docs.supermittos.com)

---

<div align="center">

**Feito com ❤️ para a comunidade futebolística brasileira**

[Website](https://supermittos.com) • [Documentação](https://docs.supermittos.com) • [Discord](https://discord.gg/supermittos)

</div>