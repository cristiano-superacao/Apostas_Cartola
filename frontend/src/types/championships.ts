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
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    country: 'Inglaterra',
    season: '2025/26',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    active: true,
    startDate: '2025-08-16',
    endDate: '2026-05-24',
    teams: 20,
    currentRound: 9,
    totalRounds: 38
  },
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    country: 'Europa',
    season: '2025/26',
    logo: '🏆',
    active: true,
    startDate: '2025-09-16',
    endDate: '2026-05-30',
    teams: 36,
    currentRound: 3,
    totalRounds: 15
  },
  {
    id: 'la-liga',
    name: 'LaLiga Santander',
    country: 'Espanha',
    season: '2025/26',
    logo: '🇪🇸',
    active: true,
    startDate: '2025-08-17',
    endDate: '2026-05-24',
    teams: 20,
    currentRound: 10,
    totalRounds: 38
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Itália',
    season: '2025/26',
    logo: '🇮🇹',
    active: true,
    startDate: '2025-08-17',
    endDate: '2026-05-24',
    teams: 20,
    currentRound: 9,
    totalRounds: 38
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Alemanha',
    season: '2025/26',
    logo: '🇩🇪',
    active: true,
    startDate: '2025-08-22',
    endDate: '2026-05-16',
    teams: 18,
    currentRound: 8,
    totalRounds: 34
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'França',
    season: '2025/26',
    logo: '🇫🇷',
    active: true,
    startDate: '2025-08-15',
    endDate: '2026-05-17',
    teams: 18,
    currentRound: 9,
    totalRounds: 34
  },
  {
    id: 'copa-libertadores',
    name: 'Copa Libertadores',
    country: 'América do Sul',
    season: '2026',
    logo: '🏆',
    active: true,
    startDate: '2026-02-03',
    endDate: '2026-11-28',
    teams: 47,
    currentRound: 1,
    totalRounds: 14
  }
]