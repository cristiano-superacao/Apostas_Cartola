# 🚀 GUIA DE INSTALAÇÃO E CONFIGURAÇÃO

## Sistema Completo de Autenticação Implementado!

### ✅ O que foi implementado:

1. **Backend Completo de Autenticação:**
   - Modelos: User, SubscriptionPlan, Payment
   - Middleware de autenticação JWT
   - Rotas: auth, admin, subscription
   - Sistema de 15 dias de trial
   - Controle de planos: mensal, semestral, anual

2. **Frontend com Autenticação:**
   - Context de autenticação
   - Páginas de login e cadastro
   - Proteção de rotas
   - Navegação com controle de acesso
   - Página de planos

3. **Sistema Administrativo:**
   - Dashboard administrativo
   - Gestão de usuários
   - Gestão de planos
   - Controle de assinaturas

## 🛠️ COMO CONFIGURAR E EXECUTAR:

### 1. Pré-requisitos
```bash
# Instalar Node.js 18+ (https://nodejs.org/)
# Instalar MongoDB (https://www.mongodb.com/try/download/community)
# OU usar Docker para MongoDB
```

### 2. MongoDB - Opção 1 (Docker - Recomendado)
```bash
# Instalar Docker Desktop
# Executar MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 3. MongoDB - Opção 2 (Instalação Local)
```bash
# Windows: Baixar e instalar MongoDB Community
# Iniciar serviço: net start MongoDB
# OU executar: "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### 4. Configurar Backend
```bash
# Navegar para pasta do backend
cd cartola-analytics/backend

# Instalar dependências
npm install

# O arquivo .env já está configurado com:
# - MongoDB: mongodb://localhost:27017/cartola-analytics
# - JWT_SECRET: cartola_jwt_secret_super_seguro_2024_token
# - PORT: 3001

# Criar conta de administrador
npm run setup:admin
```

### 5. Configurar Frontend
```bash
# Nova aba do terminal
cd cartola-analytics/frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 6. Executar Sistema
```bash
# Terminal 1 - Backend
cd cartola-analytics/backend
npm run dev

# Terminal 2 - Frontend
cd cartola-analytics/frontend
npm run dev

# OU executar ambos simultaneamente na pasta raiz:
cd cartola-analytics
npm run dev
```

## 🔑 CREDENCIAIS PADRÃO:

### Administrador:
- **Email:** admin@cartolaanalytics.com
- **Senha:** admin123456

⚠️ **IMPORTANTE:** Altere a senha após primeiro login!

## 🌐 URLs de Acesso:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Login:** http://localhost:3000/login
- **Cadastro:** http://localhost:3000/register

## 📋 FLUXO DE TESTE:

### Para Usuários:
1. Acesse http://localhost:3000/register
2. Cadastre-se com nome, email, contato e senha
3. Receba 15 dias de trial automático
4. Acesse todas as funcionalidades durante o trial
5. Após 15 dias, precisa assinar um plano

### Para Admin:
1. Acesse http://localhost:3000/login
2. Use credenciais do admin
3. Acesse painel administrativo
4. Gerencie usuários e planos
5. Ative/desative assinaturas

## 🎯 FUNCIONALIDADES IMPLEMENTADAS:

### 🔐 Autenticação:
- [x] Cadastro de usuários
- [x] Login com JWT
- [x] Proteção de rotas
- [x] Middleware de autenticação

### 👥 Usuários:
- [x] Trial de 15 dias automático
- [x] Controle de acesso por assinatura
- [x] Perfis de usuário
- [x] Status de assinatura

### 💳 Planos:
- [x] Plano Mensal (R$ 29,90)
- [x] Plano Semestral (R$ 149,90 - 17% desconto)
- [x] Plano Anual (R$ 249,90 - 30% desconto)
- [x] Sistema de pagamento simulado

### 👨‍💼 Administração:
- [x] Dashboard administrativo
- [x] Gestão de usuários
- [x] Gestão de planos
- [x] Controle de assinaturas
- [x] Relatórios e estatísticas

### 🎨 Interface:
- [x] Design responsivo
- [x] Navegação com controle de acesso
- [x] Páginas de login/cadastro
- [x] Página de planos
- [x] Proteção de rotas

## 🚨 SOLUÇÃO DE PROBLEMAS:

### MongoDB não conecta:
```bash
# Verificar se MongoDB está rodando
mongosh

# OU com Docker
docker ps
docker start mongodb
```

### Erro de porta em uso:
```bash
# Parar processo na porta 3001 ou 3000
npx kill-port 3001
npx kill-port 3000
```

### Erro de JWT:
- Verificar se JWT_SECRET está configurado no .env
- Limpar localStorage do browser (F12 > Application > Local Storage)

## 📦 PRÓXIMOS PASSOS:

1. **Integração de Pagamento:** Implementar gateway real (Stripe, PagSeguro, etc.)
2. **Email:** Sistema de envio de emails (confirmação, recuperação de senha)
3. **Analytics Avançados:** Relatórios detalhados de uso
4. **Mobile App:** Implementar autenticação no React Native
5. **Deploy:** Configurar para produção (Vercel + Railway)

## 🤝 SUPORTE:

Se houver qualquer problema na configuração, verifique:
1. MongoDB rodando na porta 27017
2. Node.js versão 18 ou superior
3. Todas as dependências instaladas
4. Portas 3000 e 3001 livres
5. Arquivo .env configurado corretamente

**Sistema está 100% funcional e pronto para uso! 🎉**