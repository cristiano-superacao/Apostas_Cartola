// Traduções para Português Brasileiro
export const translations = {
  // Dashboard
  dashboard: {
    title: 'Dashboard',
    systemOnline: 'Sistema Online',
    loading: 'Carregando dados...',
    noTeamsCreated: 'Nenhum time criado ainda',
    createFirstTeam: 'Criar Primeiro Time',
    goToOptimizer: 'Vá para o Otimizador para criar seu primeiro time!'
  },

  // Stats
  stats: {
    totalPlayers: 'Total de Jogadores',
    teamsCreated: 'Times Criados',
    averageAccuracy: 'Acurácia Média',
    bestPlayer: 'Melhor Jogador',
    recent: 'recentes',
    excellent: 'Excelente',
    regular: 'Regular',
    new: 'Novo',
    bestAccuracy: 'Melhor Acurácia',
    totalPoints: 'Pontos Totais',
    activeTeams: 'Times Ativos'
  },

  // Quick Actions
  quickActions: {
    title: 'Ações Rápidas',
    subtitle: 'Clique para navegar',
    optimizeTeam: 'Otimizar Time',
    optimizeDesc: 'Criar escalação perfeita',
    viewHistory: 'Ver Histórico',
    historyDesc: 'Times criados',
    searchPlayer: 'Buscar Jogador',
    searchDesc: 'Explorar elencos',
    marketStatus: 'Status Mercado',
    marketDesc: 'Dados atuais',
    manual: 'Manual',
    fullscreen: 'Tela Cheia'
  },

  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    players: 'Jogadores',
    optimizer: 'Otimizador',
    history: 'Histórico',
    market: 'Mercado'
  },

  // Teams
  teams: {
    recentTeams: 'Times Recentes',
    performanceSummary: 'Resumo de Performance',
    accuracy: 'acerto',
    season: 'Temporada',
    players: 'jogadores',
    averageValue: 'Valor médio'
  },

  // Championships
  championships: {
    brasileirao: 'Brasileirão Série A',
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    serieA: 'Serie A',
    bundesliga: 'Bundesliga',
    ligue1: 'Ligue 1',
    championsLeague: 'Liga dos Campeões',
    libertadores: 'Copa Libertadores'
  },

  // Positions
  positions: {
    GK: 'Goleiro',
    DEF: 'Defensor',
    MID: 'Meio-campo',
    ATT: 'Atacante'
  },

  // Currency
  currency: {
    prefix: 'R$',
    million: 'M',
    thousand: 'K'
  },

  // Common
  common: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Excluir',
    close: 'Fechar',
    open: 'Abrir',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    noData: 'Nenhum dado disponível',
    tryAgain: 'Tentar novamente'
  },

  // Date formats
  dateFormats: {
    short: 'dd/MM/yyyy',
    long: 'dd \'de\' MMMM \'de\' yyyy',
    time: 'HH:mm',
    dateTime: 'dd/MM/yyyy HH:mm'
  }
}

// Formatação de moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Formatação de números
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Formatação de porcentagem
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

// Formatação de data
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

// Formatação de data e hora
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}