export interface Championship {
  id: string
  name: string
  country: string
  season: string
  logo: string
  active: boolean
  startDate: string
  endDate: string
  teams: number
  currentRound?: number
  totalRounds?: number
}

export interface Team {
  id: number
  name: string
  shortName: string
  logo: string
  championship: string
  founded: number
  country: string
  venue?: {
    name: string
    capacity: number
    city: string
  }
}

export interface Player {
  id: number
  name: string
  position: string
  age: number
  nationality: string
  team: Team
  championship: string
  marketValue: number
  rating: number
  stats: PlayerStats
  photo: string
}

export interface PlayerStats {
  appearances: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  passAccuracy: number
  shotsOnTarget: number
  tackles: number
  interceptions: number
}

export interface ChampionshipData {
  championship: Championship
  teams: Team[]
  players: Player[]
  standings?: Standing[]
  fixtures?: Fixture[]
}

export interface Standing {
  position: number
  team: Team
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string
}

export interface Fixture {
  id: number
  date: string
  homeTeam: Team
  awayTeam: Team
  homeScore?: number
  awayScore?: number
  status: 'scheduled' | 'live' | 'finished' | 'postponed'
  round: number
}

export const AVAILABLE_CHAMPIONSHIPS: Championship[] = [
  {
    id: 'brasileiro-serie-a',
    name: 'Campeonato Brasileiro Série A',
    country: 'Brasil',
    season: '2025',
    logo: '🇧🇷',
    active: true,
    startDate: '2025-04-12',
    endDate: '2025-12-08',
    teams: 20,
    currentRound: 32,
    totalRounds: 38
  }
]