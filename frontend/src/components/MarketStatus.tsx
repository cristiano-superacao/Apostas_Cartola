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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Status do Mercado</h1>
        <div className="text-gray-500">Carregando dados do mercado...</div>
      </div>
    )
  }

  if (!marketData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Status do Mercado</h1>
        <div className="text-red-500">Erro ao carregar dados do mercado</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Status do Mercado</h1>
        <div className="mt-2 sm:mt-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            marketData.status === 'aberto' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {marketData.status === 'aberto' ? '🟢 Mercado Aberto' : '🔴 Mercado Fechado'}
          </span>
        </div>
      </div>
      
      {/* Market Status */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Visão Geral</h2>
          <div className="mt-2 sm:mt-0">
            <span className="text-sm text-gray-500">
              Atualizado: {new Date().toLocaleTimeString('pt-BR')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">Total de Ofertas</div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-900">{marketData.totalOffers}</div>
                <div className="text-xs text-blue-700 mt-1">📊 Ativas no mercado</div>
              </div>
              <div className="text-blue-500 text-2xl lg:text-3xl">🔢</div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Preço Médio</div>
                <div className="text-2xl lg:text-3xl font-bold text-green-900">€{marketData.avgPrice.toLocaleString()}</div>
                <div className="text-xs text-green-700 mt-1">💰 Por jogador</div>
              </div>
              <div className="text-green-500 text-2xl lg:text-3xl">💸</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl lg:text-3xl font-bold text-purple-600">
            {Math.floor(marketData.totalOffers * 0.15)}
          </div>
          <div className="text-sm text-gray-600">Transações Hoje</div>
          <div className="text-xs text-purple-600 mt-1">📈 +12%</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl lg:text-3xl font-bold text-orange-600">
            €{Math.floor(marketData.avgPrice * marketData.totalOffers * 0.1 / 1000)}K
          </div>
          <div className="text-sm text-gray-600">Volume Negociado</div>
          <div className="text-xs text-orange-600 mt-1">💹 Hoje</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl lg:text-3xl font-bold text-indigo-600">
            {Math.floor(marketData.totalOffers * 0.08)}
          </div>
          <div className="text-sm text-gray-600">Novos Anúncios</div>
          <div className="text-xs text-indigo-600 mt-1">✨ Últimas 24h</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl lg:text-3xl font-bold text-teal-600">94%</div>
          <div className="text-sm text-gray-600">Taxa de Sucesso</div>
          <div className="text-xs text-teal-600 mt-1">🎯 Vendas</div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Categorias Mais Populares</h2>
        
        {/* Mobile View */}
        <div className="lg:hidden space-y-3">
          {marketData.topCategories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">{category.count} ofertas</span>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {marketData.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-4">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 text-lg">{category.name}</span>
                </div>
                <span className="text-gray-600 font-medium">{category.count} ofertas</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Tendências do Mercado</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 lg:p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-green-900 text-sm lg:text-base">Atacantes em Alta</div>
              <div className="text-xs lg:text-sm text-green-700">Preços subiram 15% esta semana</div>
            </div>
            <div className="flex items-center ml-3">
              <span className="text-green-600 text-xl lg:text-2xl">📈</span>
              <span className="ml-2 text-green-700 font-bold text-sm">+15%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 lg:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-yellow-900 text-sm lg:text-base">Zagueiros Estáveis</div>
              <div className="text-xs lg:text-sm text-yellow-700">Preços mantêm-se consistentes</div>
            </div>
            <div className="flex items-center ml-3">
              <span className="text-yellow-600 text-xl lg:text-2xl">📊</span>
              <span className="ml-2 text-yellow-700 font-bold text-sm">0%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 lg:p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-red-900 text-sm lg:text-base">Meio-campistas em Baixa</div>
              <div className="text-xs lg:text-sm text-red-700">Preços caíram 8% este mês</div>
            </div>
            <div className="flex items-center ml-3">
              <span className="text-red-600 text-xl lg:text-2xl">📉</span>
              <span className="ml-2 text-red-700 font-bold text-sm">-8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-purple-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Insights do Mercado
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-purple-700">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Melhor horário para comprar: manhã (6h-10h)</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Atacantes premium valorizam 20% nos fins de semana</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Zagueiros jovens são bons investimentos a longo prazo</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Mercado mais ativo durante transmissões de jogos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}