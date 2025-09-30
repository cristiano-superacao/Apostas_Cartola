#!/usr/bin/env node

/**
 * SuperMittos - Script de Setup Interativo
 * Configuração multiplataforma em Node.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = 'green') => {
  console.log(`${colors[color]}[INFO]${colors.reset} ${message}`);
};

const warn = (message) => {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`);
};

const error = (message) => {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
};

// Interface para perguntas
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, resolve);
  });
};

// Verificar se comando existe
const commandExists = (command) => {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Verificar Node.js
const checkNode = () => {
  if (!commandExists('node')) {
    error('Node.js não está instalado');
    console.log('Instale Node.js 18+ de: https://nodejs.org/');
    process.exit(1);
  }
  
  const version = execSync('node -v', { encoding: 'utf8' }).trim();
  const majorVersion = parseInt(version.substring(1).split('.')[0]);
  
  if (majorVersion < 18) {
    error(`Node.js 18+ é necessário. Versão atual: ${version}`);
    process.exit(1);
  }
  
  log(`Node.js ${version} ✓`);
  return true;
};

// Verificar Python
const checkPython = () => {
  const pythonCommands = ['python3', 'python'];
  let pythonCmd = null;
  
  for (const cmd of pythonCommands) {
    if (commandExists(cmd)) {
      try {
        const version = execSync(`${cmd} --version`, { encoding: 'utf8' });
        const versionNum = version.match(/Python (\d+\.\d+)/)[1];
        const [major, minor] = versionNum.split('.').map(Number);
        
        if (major >= 3 && minor >= 9) {
          pythonCmd = cmd;
          log(`Python ${version.trim()} ✓`);
          break;
        }
      } catch {}
    }
  }
  
  if (!pythonCmd) {
    error('Python 3.9+ não está instalado');
    console.log('Instale Python 3.9+ de: https://python.org/');
    process.exit(1);
  }
  
  return pythonCmd;
};

// Configurar ambiente
const setupEnvironment = async () => {
  log('Configurando variáveis de ambiente...');
  
  if (!fs.existsSync('.env')) {
    fs.copyFileSync('.env.example', '.env');
    log('Arquivo .env criado');
    
    const configure = await ask('Deseja configurar o .env agora? (y/N): ');
    if (configure.toLowerCase() === 'y') {
      const dbUrl = await ask('URL do banco PostgreSQL (deixe vazio para local): ');
      const apiKey = await ask('FootyStats API Key (deixe vazio para usar exemplo): ');
      
      let envContent = fs.readFileSync('.env', 'utf8');
      
      if (dbUrl) {
        envContent = envContent.replace(
          /DATABASE_URL=.*/,
          `DATABASE_URL=${dbUrl}`
        );
      }
      
      if (apiKey) {
        envContent = envContent.replace(
          /FOOTYSTATS_API_KEY=.*/,
          `FOOTYSTATS_API_KEY=${apiKey}`
        );
      }
      
      fs.writeFileSync('.env', envContent);
      log('Arquivo .env configurado ✓');
    }
  } else {
    log('Arquivo .env já existe ✓');
  }
};

// Configurar backend
const setupBackend = async (pythonCmd) => {
  log('Configurando backend...');
  
  process.chdir('backend');
  
  // Criar virtual environment
  if (!fs.existsSync('venv')) {
    log('Criando virtual environment...');
    execSync(`${pythonCmd} -m venv venv`, { stdio: 'inherit' });
  }
  
  // Determinar comando de ativação
  const isWindows = process.platform === 'win32';
  const activateCmd = isWindows ? 'venv\\Scripts\\activate' : 'source venv/bin/activate';
  const pipCmd = isWindows ? 'venv\\Scripts\\pip' : 'venv/bin/pip';
  
  // Instalar dependências
  log('Instalando dependências Python...');
  execSync(`${pipCmd} install --upgrade pip`, { stdio: 'inherit' });
  execSync(`${pipCmd} install -r requirements.txt`, { stdio: 'inherit' });
  
  // Instalar Playwright browsers
  log('Instalando browsers do Playwright...');
  const playwrightCmd = isWindows ? 'venv\\Scripts\\playwright' : 'venv/bin/playwright';
  execSync(`${playwrightCmd} install chromium`, { stdio: 'inherit' });
  
  log('Backend configurado ✓');
  process.chdir('..');
};

// Configurar frontend
const setupFrontend = () => {
  log('Configurando frontend...');
  
  process.chdir('frontend');
  
  // Instalar dependências
  log('Instalando dependências Node.js...');
  execSync('npm install', { stdio: 'inherit' });
  
  log('Frontend configurado ✓');
  process.chdir('..');
};

// Configurar banco de dados
const setupDatabase = async () => {
  log('Verificando banco de dados...');
  
  if (commandExists('psql')) {
    try {
      const createDb = await ask('Deseja criar o banco local? (y/N): ');
      if (createDb.toLowerCase() === 'y') {
        execSync('createdb supermittos', { stdio: 'inherit' });
        execSync('psql -d supermittos -f database/schema.sql', { stdio: 'inherit' });
        log('Banco de dados local configurado ✓');
      }
    } catch (err) {
      warn('Erro ao configurar banco local. Use banco na nuvem ou configure manualmente.');
    }
  } else {
    warn('PostgreSQL não encontrado. Use banco na nuvem ou instale PostgreSQL.');
  }
};

// Exibir instruções finais
const showInstructions = () => {
  console.log(`\n${colors.green}✅ Configuração concluída!${colors.reset}\n`);
  
  console.log('Para executar o projeto:\n');
  
  console.log(`${colors.yellow}Opção 1 - Separadamente:${colors.reset}`);
  console.log('  Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload');
  console.log('  Frontend: cd frontend && npm run dev\n');
  
  console.log(`${colors.yellow}Opção 2 - Com scripts:${colors.reset}`);
  console.log('  npm run dev (executa ambos)\n');
  
  console.log(`${colors.blue}Acessos:${colors.reset}`);
  console.log('  🌐 Frontend: http://localhost:3000');
  console.log('  🔧 API:      http://localhost:8000');
  console.log('  📚 Docs:     http://localhost:8000/docs\n');
  
  console.log(`${colors.cyan}Deploy na nuvem:${colors.reset}`);
  console.log('  📖 Consulte: DEPLOYMENT.md');
  console.log('  🔧 Vercel:   vercel --prod');
  console.log('  🌐 Netlify:  netlify deploy --prod\n');
};

// Função principal
const main = async () => {
  // Banner
  console.log(`${colors.blue}`);
  console.log(`
     ____                       __  __ _ _   _            
    / ___| _   _ _ __   ___ _ __|  \\/  (_) |_| |_ ___  ___ 
    \\___ \\| | | | '_ \\ / _ \\ '__| |\\/| | | __| __/ _ \\/ __|
     ___) | |_| | |_) |  __/ |  | |  | | | |_| || (_) \\__ \\
    |____/ \\__,_| .__/ \\___|_|  |_|  |_|_|\\__|\\__\\___/|___/
                |_|                                       
  `);
  console.log(`${colors.reset}`);
  
  try {
    log('Verificando dependências...');
    checkNode();
    const pythonCmd = checkPython();
    
    log('Iniciando configuração...');
    
    await setupEnvironment();
    await setupBackend(pythonCmd);
    setupFrontend();
    await setupDatabase();
    
    showInstructions();
    
  } catch (err) {
    error(`Erro durante a configuração: ${err.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };