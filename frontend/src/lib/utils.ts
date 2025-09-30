// API configuration and utilities
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = (now.getTime() - d.getTime()) / 1000
  
  if (diffInSeconds < 60) {
    return 'agora mesmo'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m atrás`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h atrás`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d atrás`
  }
}

export const getPositionColor = (position: string): string => {
  const colors: Record<string, string> = {
    GOL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    LAT: 'bg-blue-100 text-blue-800 border-blue-200',
    ZAG: 'bg-blue-100 text-blue-800 border-blue-200',
    MEI: 'bg-green-100 text-green-800 border-green-200',
    ATA: 'bg-red-100 text-red-800 border-red-200',
    TEC: 'bg-purple-100 text-purple-800 border-purple-200',
  }
  return colors[position] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getPositionIcon = (position: string): string => {
  const icons: Record<string, string> = {
    GOL: '🥅',
    LAT: '⬅️',
    ZAG: '🛡️',
    MEI: '⚽',
    ATA: '🎯',
    TEC: '👨‍💼',
  }
  return icons[position] || '👤'
}

export const getStrategyColor = (strategy: string): string => {
  const colors: Record<string, string> = {
    conservative: 'bg-blue-100 text-blue-800',
    balanced: 'bg-green-100 text-green-800',
    aggressive: 'bg-red-100 text-red-800',
  }
  return colors[strategy] || 'bg-gray-100 text-gray-800'
}

export const getStrategyLabel = (strategy: string): string => {
  const labels: Record<string, string> = {
    conservative: 'Conservador',
    balanced: 'Equilibrado',
    aggressive: 'Agressivo',
  }
  return labels[strategy] || strategy
}

export const calculateROI = (points: number, price: number): number => {
  return price > 0 ? points / price : 0
}

export const getPerformanceColor = (value: number, type: 'score' | 'roi' | 'consistency'): string => {
  if (type === 'score') {
    if (value >= 8) return 'text-green-600'
    if (value >= 6) return 'text-yellow-600'
    return 'text-red-600'
  } else if (type === 'roi') {
    if (value >= 0.15) return 'text-green-600'
    if (value >= 0.10) return 'text-yellow-600'
    return 'text-red-600'
  } else if (type === 'consistency') {
    if (value <= 3) return 'text-green-600'
    if (value <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }
  return 'text-gray-600'
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | undefined
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}