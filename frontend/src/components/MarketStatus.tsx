import { useState, useEffect } from 'react'
import { getMarketStatus } from '../lib/api'

interface MarketData {
  status: string
  totalOffers: number
  avgPrice: number
  topCategories: Array<{
    name: string
    count: number
  }>
}

export default function MarketStatus() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const data = await getMarketStatus()
        setMarketData(data)
      } catch (error) {
        console.error('Erro ao carregar dados do mercado:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMarketData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Status do Mercado</h1>
        <div className="text-gray-500">Carregando dados do mercado...</div>
      </div>
    )
  }

  if (!marketData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Status do Mercado</h1>
        <div className="text-red-500">Erro ao carregar dados do mercado</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Status do Mercado</h1>
      
      {/* Market Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Status Atual</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            marketData.status === 'aberto' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {marketData.status === 'aberto' ? '🟢 Aberto' : '🔴 Fechado'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total de Ofertas</div>
            <div className="text-3xl font-bold text-blue-900">{marketData.totalOffers}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Preço Médio</div>
            <div className="text-3xl font-bold text-green-900">€{marketData.avgPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorias Mais Populares</h2>
        <div className="space-y-3">
          {marketData.topCategories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <span className="text-gray-600">{category.count} ofertas</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendências do Mercado</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium text-green-900">Atacantes em Alta</div>
              <div className="text-sm text-green-700">Preços subiram 15% esta semana</div>
            </div>
            <span className="text-green-600 text-2xl">📈</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <div className="font-medium text-yellow-900">Zagueiros Estáveis</div>
              <div className="text-sm text-yellow-700">Preços mantêm-se consistentes</div>
            </div>
            <span className="text-yellow-600 text-2xl">📊</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <div className="font-medium text-red-900">Meio-campistas em Baixa</div>
              <div className="text-sm text-red-700">Preços caíram 8% este mês</div>
            </div>
            <span className="text-red-600 text-2xl">📉</span>
          </div>
        </div>
      </div>
    </div>
  )
}