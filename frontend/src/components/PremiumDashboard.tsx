import { useState, useEffect } from 'react'
import { fantasyManager } from '../lib/fantasyAPI'

interface PremiumDashboardProps {
  onViewChange: (view: string) => void
}

export default function PremiumDashboard({ onViewChange }: PremiumDashboardProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [marketStatus, setMarketStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [status, market] = await Promise.all([
          fantasyManager.getSubscriptionStatus(),
          fantasyManager.getMarketStatus()
        ])
        setSubscriptionStatus(status)
        setMarketStatus(market)
      } catch (error) {
        console.error('Erro ao carregar dados premium:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isPremium = subscriptionStatus?.type !== 'free'

  return (
    <div className="space-y-6">
      {/* Premium Status Banner */}
      <div className={`rounded-lg p-4 ${
        isPremium 
          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {isPremium ? '👑' : '⭐'}
            </span>
            <div>
              <h3 className="font-bold text-lg">
                {isPremium ? `Plano ${subscriptionStatus.type.toUpperCase()}` : 'Plano Gratuito'}
              </h3>
              <p className="text-sm opacity-90">
                {isPremium 
                  ? 'Acesso completo a todas as funcionalidades premium' 
                  : 'Faça upgrade para acessar recursos avançados'
                }
              </p>
            </div>
          </div>
          {!isPremium && (
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Fazer Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Market Status - Cartola FC Style */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="mr-2">⚽</span>
            Status do Mercado Cartola FC
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            marketStatus?.status?.mercado_fechado 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {marketStatus?.status?.mercado_fechado ? '🔴 Fechado' : '🟢 Aberto'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Temporada</div>
            <div className="text-2xl font-bold text-blue-900">{marketStatus?.status?.temporada}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Rodada Atual</div>
            <div className="text-2xl font-bold text-green-900">{marketStatus?.status?.rodada_atual}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Fechamento</div>
            <div className="text-sm font-bold text-purple-900">
              {marketStatus?.fechamento ? new Date(marketStatus.fechamento).toLocaleString('pt-BR') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Funcionalidades Disponíveis</h2>
        
        <div className="space-y-4">
          {Object.entries(subscriptionStatus?.features || {}).map(([feature, available]) => {
            const featureNames: { [key: string]: string } = {
              basicAnalytics: 'Análises Básicas',
              advancedAnalytics: 'Análises Avançadas',
              aiSuggestions: 'Sugestões de IA',
              realTimeUpdates: 'Atualizações em Tempo Real',
              unlimitedTeams: 'Times Ilimitados',
              historicalData: 'Dados Históricos'
            }
            
            return (
              <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-4 h-4 rounded-full ${
                    available ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  <span className="font-medium text-gray-700">
                    {featureNames[feature] || feature}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {available ? 'Disponível' : 'Premium'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions para Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Análises Premium</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onViewChange('advanced-analytics')}
              disabled={!isPremium}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isPremium 
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="font-medium">Análise Avançada de Jogadores</div>
              <div className="text-sm opacity-75">Expected points, consistência, tendências</div>
            </button>
            
            <button 
              onClick={() => onViewChange('ai-suggestions')}
              disabled={!isPremium}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isPremium 
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="font-medium">Sugestões de IA</div>
              <div className="text-sm opacity-75">Times otimizados por inteligência artificial</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Ferramentas Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onViewChange('transfer-tracker')}
              disabled={!isPremium}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isPremium 
                  ? 'bg-green-50 hover:bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="font-medium">Rastreador de Transferências</div>
              <div className="text-sm opacity-75">Monitore mudanças de preço em tempo real</div>
            </button>
            
            <button 
              onClick={() => onViewChange('fixture-difficulty')}
              disabled={!isPremium}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isPremium 
                  ? 'bg-orange-50 hover:bg-orange-100 text-orange-700' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="font-medium">Dificuldade de Jogos</div>
              <div className="text-sm opacity-75">Analise a dificuldade dos próximos jogos</div>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription CTA for free users */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">🚀 Desbloqueie Todo o Potencial</h3>
            <p className="mb-4">
              Acesse análises avançadas, sugestões de IA e muito mais com nossos planos premium
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Premium - R$ 19,90/mês
              </button>
              <button className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                Pro - R$ 29,90/mês
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}