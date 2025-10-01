import axios from 'axios'

// URL da API - usa variável de ambiente ou fallback para localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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
    // Fallback para dados mock se API estiver offline
    return [
      { id: 1, name: "Cristiano Ronaldo", position: "ATA", team: "Al Nassr", price: 15000000, rating: 95 },
      { id: 2, name: "Lionel Messi", position: "ATA", team: "Inter Miami", price: 12000000, rating: 94 },
      { id: 3, name: "Neymar Jr", position: "ATA", team: "Al Hilal", price: 10000000, rating: 90 },
      { id: 4, name: "Kylian Mbappé", position: "ATA", team: "Real Madrid", price: 18000000, rating: 92 },
      { id: 5, name: "Erling Haaland", position: "ATA", team: "Manchester City", price: 16000000, rating: 91 }
    ]
  }
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/dashboard')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      totalPlayers: 150,
      activeOffers: 1250,
      avgPrice: 5500000,
      topPlayer: 'Cristiano Ronaldo'
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
      status: 'aberto',
      totalOffers: 2430,
      avgPrice: 5500000,
      topCategories: [
        { name: "Atacantes", count: 890 },
        { name: "Meio-campistas", count: 720 },
        { name: "Zagueiros", count: 520 },
        { name: "Goleiros", count: 300 }
      ]
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
    return [
      {
        id: 1,
        type: "buy",
        player: "Vinícius Jr",
        reason: "Em alta forma, 3 gols nos últimos 2 jogos",
        confidence: 85,
        expectedReturn: 15.5
      }
    ]
  }
}

export default api