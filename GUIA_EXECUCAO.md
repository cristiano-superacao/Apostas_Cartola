# 🚀 SuperMittos - Guia de Execução Local

## ✅ Como Corrigir e Executar a Aplicação

### ❌ Erro que você encontrou:
```bash
npm start  # ERRADO - executado no diretório raiz
```

### ✅ Solução Correta:

## 📝 Passo a Passo:

### 1. 🖥️ Backend (Terminal 1):
```bash
# Navegar para o backend
cd c:\Users\bivol\Documents\GitHub\analise_fut\supermittos\backend

# Executar o servidor Python simples
python simple_server.py
```

**✅ Resultado esperado:**
```
🚀 SuperMittos API rodando em http://localhost:8000
📊 Endpoints disponíveis:
   • GET /health - Status da API
   • GET /api/v1/players - Lista de jogadores
   ...
⚡ Pressione Ctrl+C para parar o servidor
```

### 2. 🌐 Frontend (Terminal 2 - NOVO TERMINAL):
```bash
# Navegar para o frontend
cd c:\Users\bivol\Documents\GitHub\analise_fut\supermittos\frontend

# Executar o Next.js (desenvolvimento)
npm run dev
```

**✅ Resultado esperado:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

## 🌍 URLs para Testar:

### Frontend:
- **Aplicação Principal:** http://localhost:3000

### Backend APIs:
- **Health Check:** http://localhost:8000/health
- **Lista Jogadores:** http://localhost:8000/api/v1/players
- **Sugestões:** http://localhost:8000/api/v1/suggestions
- **Status Mercado:** http://localhost:8000/api/v1/market/status
- **Dashboard:** http://localhost:8000/api/v1/analytics/dashboard

## 🔧 Comandos Alternativos:

### Se `npm run dev` não funcionar:
```bash
# Instalar dependências (se necessário)
npm install

# Tentar com yarn (se instalado)
yarn dev

# Verificar scripts disponíveis
npm run
```

### Scripts disponíveis no frontend:
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção (após build)
- `npm run lint` - Verificar código

## 🚨 Solução de Problemas:

### Se a porta 3000 estiver ocupada:
```bash
# O Next.js tentará automaticamente a próxima porta disponível (3001, 3002, etc.)
```

### Se a porta 8000 estiver ocupada:
```bash
# O servidor Python tentará automaticamente uma porta livre
```

### Se houver erros de dependências:
```bash
# No frontend
npm install --legacy-peer-deps

# No backend (se usar FastAPI)
pip install -r requirements_simple.txt
```

## ✅ Status de Funcionamento:

Quando tudo estiver funcionando corretamente:

1. **Backend** 🟢 - Servidor Python rodando na porta 8000
2. **Frontend** 🟢 - Next.js rodando na porta 3000
3. **Integração** 🟢 - Frontend conectando com backend via API

## 📱 Interface de Teste:

A página principal (http://localhost:3000) mostrará:
- ✅ Status do Backend (Online/Offline)
- ✅ Status do Frontend (Online)
- ✅ Lista de jogadores carregados
- ✅ Links para testar todas as APIs

---

**🎯 Resumo:** Execute sempre os comandos nos diretórios corretos e use `npm run dev` para desenvolvimento!