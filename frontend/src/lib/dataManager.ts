// Sistema de gerenciamento de dados dinâmicos
import { Player } from '../types/championships'

interface MarketVariation {
  playerId: number
  timestamp: number
  oldValue: number
  newValue: number
  change: number
  changePercent: number
}

interface MarketSession {
  startTime: number
  variations: MarketVariation[]
  totalTransactions: number
  averageChange: number
}

export default class DataManager {
  private static instance: DataManager
  private updateInterval: number | null = null
  private listeners: Set<Function> = new Set()
  private marketSession: MarketSession
  private isActive: boolean = false

  private constructor() {
    this.marketSession = this.loadSession()
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  // Iniciar sistema de auto-atualização
  startAutoUpdate(intervalMs: number = 30000) {
    if (this.updateInterval) return

    this.isActive = true
    this.updateInterval = window.setInterval(() => {
      this.simulateMarketChanges()
    }, intervalMs)

    console.log('🔄 Sistema de auto-atualização iniciado')
  }

  // Parar sistema de auto-atualização
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
      this.isActive = false
      console.log('⏸️ Sistema de auto-atualização pausado')
    }
  }

  // Verificar se está ativo
  isAutoUpdateActive(): boolean {
    return this.isActive
  }

  // Adicionar listener para mudanças
  addListener(callback: Function) {
    this.listeners.add(callback)
  }

  // Remover listener
  removeListener(callback: Function) {
    this.listeners.delete(callback)
  }

  // Notificar listeners
  private notifyListeners(data: any) {
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Erro ao notificar listener:', error)
      }
    })
  }

  // Simular mudanças no mercado
  private simulateMarketChanges() {
    const players = this.getStoredPlayers()
    if (!players || players.length === 0) return

    const updates: MarketVariation[] = []
    const numPlayersToUpdate = Math.min(
      Math.floor(players.length * 0.1), // 10% dos jogadores
      20 // Máximo 20 por vez
    )

    // Selecionar jogadores aleatórios para atualizar
    const playersToUpdate = this.getRandomPlayers(players, numPlayersToUpdate)

    playersToUpdate.forEach(player => {
      const oldValue = player.marketValue
      const volatility = this.getPlayerVolatility(player)
      const changePercent = this.generateMarketChange(volatility)
      const newValue = Math.max(
        oldValue * (1 + changePercent),
        1000000 // Valor mínimo de R$ 1M
      )
      const change = newValue - oldValue

      // Atualizar valor do jogador
      player.marketValue = Math.round(newValue)

      const variation: MarketVariation = {
        playerId: player.id,
        timestamp: Date.now(),
        oldValue,
        newValue: player.marketValue,
        change,
        changePercent: changePercent * 100
      }

      updates.push(variation)
      this.marketSession.variations.push(variation)
    })

    // Atualizar estatísticas da sessão
    this.marketSession.totalTransactions += updates.length
    this.marketSession.averageChange = this.calculateAverageChange()

    // Salvar dados atualizados
    this.savePlayersData(players)
    this.saveSession()

    // Notificar componentes sobre as mudanças
    this.notifyListeners({
      type: 'MARKET_UPDATE',
      updates,
      timestamp: Date.now(),
      session: this.marketSession
    })

    console.log(`📊 Mercado atualizado: ${updates.length} jogadores afetados`)
  }

  // Calcular volatilidade do jogador
  private getPlayerVolatility(player: Player): number {
    let volatility = 0.02 // Base 2%

    // Jogadores jovens são mais voláteis
    if (player.age < 25) volatility += 0.01
    if (player.age > 32) volatility += 0.005

    // Jogadores com rating alto são menos voláteis
    if (player.rating > 85) volatility *= 0.8
    else if (player.rating < 70) volatility += 0.01

    // Atacantes e meio-campistas são mais voláteis
    if (player.position === 'ATT') volatility += 0.005
    if (player.position === 'MID') volatility += 0.003

    return Math.min(volatility, 0.05) // Máximo 5%
  }

  // Gerar mudança no mercado
  private generateMarketChange(volatility: number): number {
    // Distribuição normal com tendência ligeiramente positiva
    const trend = 0.001 // 0.1% de tendência positiva
    const randomChange = (Math.random() - 0.5) * 2 * volatility
    return trend + randomChange
  }

  // Selecionar jogadores aleatórios
  private getRandomPlayers(players: Player[], count: number): Player[] {
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  // Calcular mudança média da sessão
  private calculateAverageChange(): number {
    if (this.marketSession.variations.length === 0) return 0
    
    const totalChange = this.marketSession.variations.reduce(
      (sum, variation) => sum + variation.changePercent, 0
    )
    
    return totalChange / this.marketSession.variations.length
  }

  // Obter dados dos jogadores do localStorage
  private getStoredPlayers(): Player[] | null {
    try {
      const stored = localStorage.getItem('supermittos_players')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Erro ao carregar jogadores do localStorage:', error)
      return null
    }
  }

  // Salvar dados dos jogadores
  private savePlayersData(players: Player[]) {
    try {
      localStorage.setItem('supermittos_players', JSON.stringify(players))
    } catch (error) {
      console.error('Erro ao salvar jogadores no localStorage:', error)
    }
  }

  // Carregar sessão do localStorage
  private loadSession(): MarketSession {
    try {
      const stored = localStorage.getItem('supermittos_market_session')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erro ao carregar sessão do localStorage:', error)
    }

    // Criar nova sessão
    return {
      startTime: Date.now(),
      variations: [],
      totalTransactions: 0,
      averageChange: 0
    }
  }

  // Salvar sessão
  private saveSession() {
    try {
      localStorage.setItem('supermittos_market_session', JSON.stringify(this.marketSession))
    } catch (error) {
      console.error('Erro ao salvar sessão no localStorage:', error)
    }
  }

  // Obter estatísticas da sessão
  getSessionStats() {
    return {
      ...this.marketSession,
      duration: Date.now() - this.marketSession.startTime,
      recentVariations: this.marketSession.variations.slice(-10)
    }
  }

  // Resetar sessão
  resetSession() {
    this.marketSession = {
      startTime: Date.now(),
      variations: [],
      totalTransactions: 0,
      averageChange: 0
    }
    this.saveSession()
    console.log('🔄 Sessão do mercado resetada')
  }

  // Limpar dados do localStorage
  clearStoredData() {
    localStorage.removeItem('supermittos_players')
    localStorage.removeItem('supermittos_market_session')
    this.resetSession()
    console.log('🗑️ Dados do localStorage limpos')
  }

  // Inicializar dados dos jogadores se não existirem
  initializePlayersData(players: Player[]) {
    const stored = this.getStoredPlayers()
    if (!stored || stored.length === 0) {
      this.savePlayersData(players)
      console.log('💾 Dados iniciais dos jogadores salvos')
    }
  }

  // Obter histórico de variações de um jogador
  getPlayerHistory(playerId: number): MarketVariation[] {
    return this.marketSession.variations.filter(
      variation => variation.playerId === playerId
    ).sort((a, b) => b.timestamp - a.timestamp)
  }

  // Obter top performers da sessão
  getTopPerformers(limit: number = 10): MarketVariation[] {
    return [...this.marketSession.variations]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit)
  }

  // Obter worst performers da sessão
  getWorstPerformers(limit: number = 10): MarketVariation[] {
    return [...this.marketSession.variations]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit)
  }
}