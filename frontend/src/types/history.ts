export interface TeamHistory {
  id: string
  name: string
  championship: {
    id: string
    name: string
    season: string
    logo: string
  }
  formation: string
  budget: number
  totalCost: number
  players: HistoryPlayer[]
  createdAt: string
  predictions?: TeamPredictions
  actualResults?: TeamResults
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  notes?: string
}

export interface HistoryPlayer {
  id: number
  name: string
  position: string
  team: string
  marketValue: number
  rating: number
  photo: string
  stats?: {
    appearances: number
    goals: number
    assists: number
    rating: number
  }
}

export interface TeamPredictions {
  expectedPoints: number
  expectedGoals: number
  expectedAssists: number
  expectedCleanSheets: number
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number // 0-100
  strongPositions: string[]
  weakPositions: string[]
  keyPlayers: string[]
}

export interface TeamResults {
  actualPoints: number
  actualGoals: number
  actualAssists: number
  actualCleanSheets: number
  matchesPlayed: number
  accuracy: number // 0-100
  performanceByPosition: { [position: string]: number }
  bestPerformers: string[]
  worstPerformers: string[]
  updatedAt: string
}

export interface PerformanceMetrics {
  totalTeamsCreated: number
  averageAccuracy: number
  bestAccuracy: number
  worstAccuracy: number
  totalPointsEarned: number
  averagePointsPerTeam: number
  successfulPredictions: number
  failedPredictions: number
  championshipBreakdown: { [championshipId: string]: ChampionshipMetrics }
  formationBreakdown: { [formation: string]: FormationMetrics }
  monthlyPerformance: MonthlyMetrics[]
}

export interface ChampionshipMetrics {
  championshipName: string
  teamsCreated: number
  averageAccuracy: number
  totalPoints: number
  bestTeam: string
  worstTeam: string
}

export interface FormationMetrics {
  teamsCreated: number
  averageAccuracy: number
  averagePoints: number
  successRate: number
}

export interface MonthlyMetrics {
  month: string
  year: number
  teamsCreated: number
  averageAccuracy: number
  totalPoints: number
}

export const FORMATION_TEMPLATES = {
  '4-3-3': {
    name: '4-3-3 Ataque',
    positions: {
      GK: 1,
      CB: 2,
      LB: 1,
      RB: 1,
      CDM: 1,
      CM: 2,
      LW: 1,
      RW: 1,
      ST: 1
    },
    style: 'Ofensivo',
    description: 'Formação focada no ataque com wingers largos'
  },
  '4-4-2': {
    name: '4-4-2 Clássico',
    positions: {
      GK: 1,
      CB: 2,
      LB: 1,
      RB: 1,
      LM: 1,
      CM: 2,
      RM: 1,
      ST: 2
    },
    style: 'Equilibrado',
    description: 'Formação equilibrada entre defesa e ataque'
  },
  '3-5-2': {
    name: '3-5-2 Meio-campo',
    positions: {
      GK: 1,
      CB: 3,
      LWB: 1,
      RWB: 1,
      CDM: 1,
      CM: 2,
      CAM: 1,
      ST: 2
    },
    style: 'Controle',
    description: 'Domínio do meio-campo com laterais ofensivos'
  },
  '5-3-2': {
    name: '5-3-2 Defensivo',
    positions: {
      GK: 1,
      CB: 3,
      LB: 1,
      RB: 1,
      CDM: 1,
      CM: 2,
      ST: 2
    },
    style: 'Defensivo',
    description: 'Formação sólida defensiva com contra-ataques'
  }
}