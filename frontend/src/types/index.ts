// SuperMittos Frontend Types
export interface Player {
  id: string
  cartola_id: number
  name: string
  nickname?: string
  club_name?: string
  position_name: string
  position_abbrev: string
  current_price?: number
  avg_score?: number
  recent_form?: number
  consistency?: number
  prob_starter?: number
  active: boolean
}

export interface PlayerStats {
  player_id: string
  round_number: number
  cartola_points?: number
  price?: number
  played: boolean
  minutes: number
  goals: number
  assists: number
  xg?: number
  xa?: number
  rating?: number
}

export interface TeamSuggestion {
  id: string
  round_number: number
  formation: string
  strategy: string
  expected_score?: number
  total_cost?: number
  expected_roi?: number
  created_at: string
}

export interface SuggestionPlayer {
  player_id: string
  player_name: string
  position: string
  expected_points?: number
  price?: number
  captain: boolean
  vice_captain: boolean
}

export interface TeamSuggestionDetail extends TeamSuggestion {
  players: SuggestionPlayer[]
}

export interface MarketStatus {
  current_round: number
  market_open: boolean
  season: string
  last_updated: string
}

export interface ETLStatus {
  is_running: boolean
  last_execution?: string
  last_duration?: number
  status: string
  players_processed: number
  success: boolean
  error_message?: string
}

export interface DashboardData {
  total_players: number
  market_stats: {
    avg_price: number
    min_price: number
    max_price: number
  }
  position_distribution: {
    position: string
    count: number
    avg_score: number
  }[]
  last_updated: string
}

export interface TopPerformer {
  name: string
  nickname?: string
  club: string
  position: string
  avg_score?: number
  recent_form?: number
  current_price?: number
  roi?: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export type Position = 'GOL' | 'LAT' | 'ZAG' | 'MEI' | 'ATA'
export type Strategy = 'conservative' | 'balanced' | 'aggressive'
export type Formation = '3-4-3' | '3-5-2' | '4-3-3' | '4-4-2' | '5-3-2'

export interface FilterOptions {
  position?: Position
  club_id?: number
  min_price?: number
  max_price?: number
  strategy?: Strategy
  formation?: Formation
}