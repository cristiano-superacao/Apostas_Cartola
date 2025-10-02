// API para integração com Cartola FC e outras plataformas fantasy
export interface CartolaPlayer {
  atleta_id: number
  nome: string
  apelido: string
  posicao_id: number
  clube_id: number
  preco_num: number
  pontos_num: number
  scout: {
    G?: number   // Gols
    A?: number   // Assistências  
    SG?: number  // Jogo sem sofrer gol
    DE?: number  // Defesas
    FS?: number  // Faltas sofridas
    PE?: number  // Penaltis perdidos
    I?: number   // Impedimentos
    PP?: number  // Penaltis perdidos
    FT?: number  // Finalizações na trave
    FD?: number  // Finalizações defendidas
    FF?: number  // Finalizações para fora
    GS?: number  // Gols sofridos
    CA?: number  // Cartões amarelos
    CV?: number  // Cartões vermelhos
  }
  status_id: number
  variacao_num: number
  media_num: number
  jogos_num: number
}

export interface CartolaTeam {
  id: number
  nome: string
  nome_cartola: string
  abreviacao: string
  escudos: {
    '60x60': string
    '45x45': string
    '30x30': string
  }
}

export interface CartolaMarket {
  status: {
    mercado_fechado: boolean
    temporada: number
    rodada_atual: number
    mes: number
    game_over: boolean
  }
  fechamento: string
}

export interface FantasyConfig {
  platform: 'cartola' | 'premiere' | 'custom'
  budget: number
  formation: string
  enablePremiumFeatures: boolean
  autoUpdate: boolean
  notifications: boolean
}

// Simulação da API do Cartola FC
export class CartolaAPI {
  // Placeholder for future Cartola FC API integration
  // private baseUrl = 'https://api.cartolafc.globo.com'
  
  async getMarketStatus(): Promise<CartolaMarket> {
    try {
      // Em produção, seria uma chamada real à API
      return {
        status: {
          mercado_fechado: false,
          temporada: 2025,
          rodada_atual: 32,
          mes: 10,
          game_over: false
        },
        fechamento: '2025-10-05T14:00:00'
      }
    } catch (error) {
      console.error('Erro ao buscar status do mercado:', error)
      throw error
    }
  }

  async getPlayers(position?: string): Promise<CartolaPlayer[]> {
    try {
      // Simulação de dados do Cartola FC
      const mockPlayers: CartolaPlayer[] = [
        {
          atleta_id: 37678,
          nome: 'Matheus Jussa',
          apelido: 'Matheus Jussa',
          posicao_id: 3,
          clube_id: 262,
          preco_num: 12.5,
          pontos_num: 85.2,
          scout: { G: 8, A: 5, FS: 12 },
          status_id: 7,
          variacao_num: 2.3,
          media_num: 6.8,
          jogos_num: 25
        },
        {
          atleta_id: 45821,
          nome: 'Everton Ribeiro',
          apelido: 'Everton Ribeiro',
          posicao_id: 4,
          clube_id: 262,
          preco_num: 15.8,
          pontos_num: 92.7,
          scout: { G: 6, A: 12, FS: 18 },
          status_id: 7,
          variacao_num: 1.5,
          media_num: 7.2,
          jogos_num: 28
        }
        // Mais jogadores...
      ]
      
      return position 
        ? mockPlayers.filter(p => p.posicao_id === parseInt(position))
        : mockPlayers
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
      throw error
    }
  }

  async getTeams(): Promise<CartolaTeam[]> {
    try {
      // Simulação de dados dos times
      return [
        {
          id: 262,
          nome: 'Flamengo',
          nome_cartola: 'Flamengo',
          abreviacao: 'FLA',
          escudos: {
            '60x60': '/teams/flamengo_60x60.png',
            '45x45': '/teams/flamengo_45x45.png',
            '30x30': '/teams/flamengo_30x30.png'
          }
        },
        {
          id: 276,
          nome: 'Palmeiras',
          nome_cartola: 'Palmeiras',
          abreviacao: 'PAL',
          escudos: {
            '60x60': '/teams/palmeiras_60x60.png',
            '45x45': '/teams/palmeiras_45x45.png',
            '30x30': '/teams/palmeiras_30x30.png'
          }
        }
        // Mais times...
      ]
    } catch (error) {
      console.error('Erro ao buscar times:', error)
      throw error
    }
  }
}

// Funcionalidades Premium
export class PremiumFeatures {
  private isAuthenticated = false
  private subscriptionType: 'free' | 'premium' | 'pro' = 'free'

  async authenticate(_token: string): Promise<boolean> {
    try {
      // Simulação de autenticação
      this.isAuthenticated = true
      this.subscriptionType = 'premium'
      return true
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return false
    }
  }

  async getAdvancedAnalytics(_playerId: number) {
    if (!this.isPremium()) {
      throw new Error('Funcionalidade premium requerida')
    }

    return {
      expectedPoints: 8.5,
      consistency: 0.75,
      upcomingFixtures: [
        { opponent: 'Palmeiras', difficulty: 4, home: true },
        { opponent: 'Corinthians', difficulty: 3, home: false }
      ],
      injuryRisk: 0.15,
      formTrend: 'ascending',
      valueForMoney: 0.85
    }
  }

  async getAITeamSuggestions(config: FantasyConfig) {
    if (!this.isPremium()) {
      throw new Error('Funcionalidade premium requerida')
    }

    return {
      optimalTeam: {
        formation: config.formation,
        players: [],
        expectedPoints: 95.5,
        totalCost: config.budget * 0.98,
        riskLevel: 'medium'
      },
      alternatives: [
        {
          formation: config.formation,
          players: [],
          expectedPoints: 92.1,
          totalCost: config.budget * 0.85,
          riskLevel: 'low'
        }
      ]
    }
  }

  async getRealTimeUpdates() {
    if (!this.isPremium()) {
      throw new Error('Funcionalidade premium requerida')
    }

    return {
      liveScores: [],
      playerUpdates: [],
      marketMovements: [],
      lastUpdate: new Date().toISOString()
    }
  }

  isPremium(): boolean {
    return this.isAuthenticated && (this.subscriptionType === 'premium' || this.subscriptionType === 'pro')
  }

  isPro(): boolean {
    return this.isAuthenticated && this.subscriptionType === 'pro'
  }
}

// Manager principal para fantasy games
export class FantasyManager {
  private cartolaAPI: CartolaAPI
  private premiumFeatures: PremiumFeatures
  private config: FantasyConfig

  constructor() {
    this.cartolaAPI = new CartolaAPI()
    this.premiumFeatures = new PremiumFeatures()
    this.config = this.loadConfig()
  }

  private loadConfig(): FantasyConfig {
    const saved = localStorage.getItem('fantasy-config')
    return saved ? JSON.parse(saved) : {
      platform: 'cartola',
      budget: 100,
      formation: '4-3-3',
      enablePremiumFeatures: false,
      autoUpdate: true,
      notifications: true
    }
  }

  async saveConfig(config: FantasyConfig) {
    this.config = config
    localStorage.setItem('fantasy-config', JSON.stringify(config))
  }

  async getPlayers(filters?: { position?: string; team?: string; maxPrice?: number }) {
    const players = await this.cartolaAPI.getPlayers(filters?.position)
    
    if (this.premiumFeatures.isPremium()) {
      // Adicionar dados premium
      return players.map(player => ({
        ...player,
        premiumData: {
          expectedPoints: Math.random() * 10 + 5,
          consistency: Math.random(),
          valueRating: Math.random() * 5
        }
      }))
    }
    
    return players
  }

  async getMarketStatus() {
    return await this.cartolaAPI.getMarketStatus()
  }

  async getTeams() {
    return await this.cartolaAPI.getTeams()
  }

  async generateOptimalTeam(customConfig?: Partial<FantasyConfig>) {
    const finalConfig = { ...this.config, ...customConfig }
    
    if (this.premiumFeatures.isPremium()) {
      return await this.premiumFeatures.getAITeamSuggestions(finalConfig)
    }
    
    // Versão básica para usuários free
    return {
      optimalTeam: {
        formation: finalConfig.formation,
        players: [],
        expectedPoints: 75.0,
        totalCost: finalConfig.budget * 0.90,
        riskLevel: 'medium'
      },
      alternatives: []
    }
  }

  getSubscriptionStatus() {
    return {
      isAuthenticated: this.premiumFeatures.isPremium(),
      type: this.premiumFeatures.isPro() ? 'pro' : 
            this.premiumFeatures.isPremium() ? 'premium' : 'free',
      features: {
        basicAnalytics: true,
        advancedAnalytics: this.premiumFeatures.isPremium(),
        aiSuggestions: this.premiumFeatures.isPremium(),
        realTimeUpdates: this.premiumFeatures.isPremium(),
        unlimitedTeams: this.premiumFeatures.isPro(),
        historicalData: this.premiumFeatures.isPro()
      }
    }
  }
}

// Instância global
export const fantasyManager = new FantasyManager()