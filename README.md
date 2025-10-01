<<<<<<< HEAD
# SuperMittos - Plataforma de Análise Futebolística 🏆

![SuperMittos Logo](https://img.shields.io/badge/SuperMittos-Football%20Analytics-blue)
![React](https://img.shields.io/badge/React-18.2+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)
![Vite](https://img.shields.io/badge/Vite-4.5+-yellow)

## 🎯 Visão Geral

SuperMittos é uma plataforma avançada de análise futebolística que coleta dados de múltiplas fontes, realiza análises inteligentes e gera sugestões otimizadas de times para Cartola FC e principais campeonatos mundiais.

### ✨ Funcionalidades Principais

- 🔄 **ETL Automatizado**: Coleta dados do Cartola FC, FootyStats, SofaScore e sites de prováveis escalações
- 🤖 **IA para Otimização**: Algoritmos de programação linear para criação de times ideais
- 📊 **Analytics Avançado**: Dashboards interativos com estatísticas detalhadas
- 🌐 **Interface Responsiva**: Frontend moderno em React + Vite
- 🔗 **API Robusta**: Backend Python com integração PostgreSQL/Supabase
- ⚡ **Performance Otimizada**: Build otimizado com code splitting

## 🏗️ Arquitetura

```
SuperMittos/
├── 🔧 Backend (Python)
│   ├── API HTTP com PostgreSQL
│   ├── Sistema ETL multi-source
│   ├── Engine de otimização
│   └── Integração Supabase
│
├── 🎨 Frontend (React + Vite)
│   ├── Dashboard interativo
│   ├── Visualizações em tempo real
│   ├── Interface responsiva
│   └── Build otimizado (195KB)
│
├── 🗄️ Database (PostgreSQL/Supabase)
│   ├── Schema completo
│   ├── Connection pooling
│   ├── Views analíticas
│   └── Dados mock para fallback
│
└── 🚀 Deploy (Netlify)
    ├── SPA configuration
    ├── Auto-deploy GitHub
    ├── Otimizações de performance
    └── https://supermittos.netlify.app
```

## 🚀 Quick Start

### 💻 Desenvolvimento Local
```bash
# 1. Clone o repositório
git clone https://github.com/cristiano-superacao/Apostas_Cartola.git
cd supermittos

# 2. Frontend (React + Vite)
cd frontend
npm install
npm run dev  # http://localhost:5173

# 3. Backend (Python)
cd ../backend
python supabase_server.py  # http://localhost:8000
```

### ☁️ Deploy na Nuvem
```bash
# 1. Build otimizado
cd frontend
npm run build  # dist/ com 195KB otimizado

# 2. Deploy Netlify (3 opções)
# Manual: arraste frontend/dist para netlify.com
# Auto: conecte GitHub repo no Netlify
# CLI: npx netlify deploy --prod --dir=dist
```

### 🎯 Acessos
- 🌍 **Frontend**: http://localhost:5173 (local) | https://supermittos.netlify.app (prod)
- 🔧 **API**: http://localhost:8000 (local)
- 📚 **Build**: 195KB total, code splitting ativo

## 📊 Performance e Otimizações

### Build Otimizado
- **Total**: 195KB (64KB compressed)
- **Vendor**: 140KB (bibliotecas)
- **Utils**: 35KB (utilitários)
- **App**: 18KB (código principal)
- **CSS**: 17KB (estilos)
- **Code Splitting**: Ativo
- **Build Time**: ~24s

### Features Técnicas
- SPA com React Router
- Fallback data para offline
- Environment variables (VITE_API_URL)
- Responsive design (mobile-first)
- TypeScript strict mode
- Tailwind CSS otimizado

## 🚀 Deploy e Produção

### ✅ PRONTO PARA DEPLOY!

#### 🔥 **MAIS RÁPIDO: Upload Manual**
1. Vá para: https://app.netlify.com/sites/supermittos/deploys
2. Arraste a pasta `frontend/dist` para "Deploy manually"
3. ✅ Pronto! https://supermittos.netlify.app

#### ⚡ **MAIS INTELIGENTE: GitHub Auto-Deploy**
1. https://app.netlify.com/sites/supermittos/settings/deploys
2. "Link repository" → `cristiano-superacao/Apostas_Cartola`
3. Build command: `cd frontend && npm install && npm run build`
4. Publish directory: `frontend/dist`

#### 💻 **MAIS TÉCNICO: Netlify CLI**
```bash
cd frontend
npx netlify deploy --prod --dir=dist --site=supermittos
```

### Estrutura do Projeto
```
frontend/
├── src/
│   ├── App.tsx           # App principal React
│   ├── components/       # Componentes React
│   ├── lib/             # API e utils
│   └── types/           # TypeScript interfaces
├── package.json         # Dependências Node.js
└── dist/               # Build otimizado (195KB)

backend/
├── supabase_server.py   # Servidor Python + PostgreSQL
├── simple_server.py     # Servidor mock simples
└── requirements.txt     # Dependências Python

database/
└── supabase_complete_schema.sql  # Schema PostgreSQL
```

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

## 📊 Dashboard Analytics

### Funcionalidades Ativas
- 📈 Dashboard com estatísticas
- 👥 Lista de jogadores
- ⚽ Otimizador de time
- 📊 Status do mercado
- 📱 Design responsivo
- 🔄 Dados mock funcionando

## 🛠️ Desenvolvimento

### Stack Atualizada
- **Frontend**: React 18.2.0 + Vite 4.5.14 (migrado do Next.js)
- **Backend**: Python HTTP server + PostgreSQL
- **Database**: Supabase/PostgreSQL com connection pooling
- **Deploy**: Netlify com SPA configuration

### Comandos Principais
```bash
# Frontend
npm run dev      # Desenvolvimento
npm run build    # Build otimizado
npm run preview  # Preview da build

# Backend
python supabase_server.py    # Servidor com PostgreSQL
python simple_server.py      # Servidor mock simples
```

## 🤝 Contribuindo

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Comunidade Cartola FC
- Desenvolvedores do React e Vite
- Time do Supabase
- Contribuidores open-source

## 📞 Suporte

- 🐛 Issues: [GitHub Issues](https://github.com/cristiano-superacao/Apostas_Cartola/issues)
- 🌐 Site: https://supermittos.netlify.app

---

<div align="center">

**Feito com ❤️ para a comunidade futebolística brasileira**

[Website](https://supermittos.netlify.app) • [Deploy Guide](DEPLOY_NOW.md)

</div>
=======
# README - Cartola Analytics & Apostas Esportivas

Sistema completo de análise do Cartola FC e apostas esportivas com frontend web e aplicativo móvel.

## 🚀 Tecnologias

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Rate Limiting

### Frontend
- Next.js 14 + React
- Tailwind CSS
- TypeScript
- Axios

### Mobile
- React Native + Expo
- NativeWind
- React Navigation

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB (local ou MongoDB Atlas)
- Git
- Expo CLI (para o aplicativo móvel)

## ⚡ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/cristiano-superacao/Apostas_Cartola.git
cd Apostas_Cartola/cartola-analytics
```

### 2. Configuração do Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```bash
# Base de Dados
MONGODB_URI=mongodb://localhost:27017/cartola-analytics
PORT=3001
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
```

### 3. Configuração do Frontend
```bash
cd ../frontend
npm install
```

### 4. Configuração do Mobile
```bash
cd ../mobile
npm install
```

### 5. MongoDB
Certifique-se de que o MongoDB está rodando:
```bash
# Windows (se instalado como serviço)
net start MongoDB

# Ou usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🏃‍♂️ Executando o Projeto

### Opção 1: Executar todos os serviços (recomendado)
```bash
# Na pasta raiz (cartola-analytics)
npm run dev
```

### Opção 2: Executar individualmente

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Mobile:**
```bash
cd mobile
npm start
```

## 📱 Acesso às Aplicações

- **Frontend Web:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Mobile:** Use o Expo Go app para escanear o QR code

## 🔗 Endpoints da API

### Jogadores
- `GET /api/players` - Lista jogadores
- `POST /api/players/optimize-team` - Otimiza escalação

### Times
- `GET /api/teams` - Lista times
- `POST /api/teams` - Cria novo time

### Partidas
- `GET /api/matches` - Lista partidas
- `GET /api/matches/:id` - Detalhes da partida

### Apostas
- `GET /api/bets` - Lista apostas
- `GET /api/bets/stats` - Estatísticas de apostas

### Analytics
- `GET /api/analytics/dashboard` - Dashboard principal
- `GET /api/analytics/players` - Analytics de jogadores
- `GET /api/analytics/teams` - Analytics de times

### Histórico
- `GET /api/history/teams` - Histórico de times
- `GET /api/history/bets` - Histórico de apostas

## 🐳 Docker (Opcional)

Para executar com Docker:

```bash
# Na pasta raiz
docker-compose up -d
```

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy para Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy para sua plataforma preferida
```

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Execução em desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Execução de produção

### Frontend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Execução de produção

### Mobile
- `npm start` - Inicia o Expo
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS

## 📄 Licença

Este projeto está sob a licença MIT.
>>>>>>> a4d661dd3ce14faa6f78ad33152757cb2e4e2d1f
