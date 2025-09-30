import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Player {
  id: number
  name: string
  position: string
  team: string
  price: number
  rating: number
}

export interface DashboardData {
  totalPlayers: number
  activeOffers: number
  avgPrice: number
  topPlayer: string
}

export interface MarketData {
  status: string
  totalOffers: number
  avgPrice: number
  topCategories: Array<{
    name: string
    count: number
  }>
}

// API Functions
export const getPlayers = async (): Promise<Player[]> => {
  try {
    const response = await api.get('/players')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    return []
  }
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/dashboard')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      totalPlayers: 0,
      activeOffers: 0,
      avgPrice: 0,
      topPlayer: 'N/A'
    }
  }
}

export const getMarketStatus = async (): Promise<MarketData> => {
  try {
    const response = await api.get('/market-status')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar status do mercado:', error)
    return {
      status: 'fechado',
      totalOffers: 0,
      avgPrice: 0,
      topCategories: []
    }
  }
}

export const getSuggestions = async (budget?: number): Promise<any[]> => {
  try {
    const params = budget ? { budget } : {}
    const response = await api.get('/suggestions', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error)
    return []
  }
}

export default api