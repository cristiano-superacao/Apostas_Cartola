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