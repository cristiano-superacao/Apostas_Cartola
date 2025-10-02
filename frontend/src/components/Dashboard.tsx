import { useTeamHistory } from '../hooks/useTeamHistory'
import { Championship } from '../types/championships'

interface DashboardData {
  totalPlayers: number
  activeOffers: number
  avgPrice: number
  topPlayer: string
}

interface DashboardProps {
  data: DashboardData | null
  championship?: Championship
  onViewChange: (view: string) => void
}

export default function Dashboard({ data, onViewChange }: DashboardProps) {
  const {
    teamHistory,
    performanceMetrics,
    getRecentTeams
  } = useTeamHistory()

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-gray-500">Carregando dados...</div>
      </div>
    )
  }

  const recentTeams = getRecentTeams(3)

  // Stats baseados na imagem
  const stats = [
    {
      name: 'Total de Jogadores',
      value: '838',
      icon: '👥',
      iconBg: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Times Criados',
      value: '0',
      icon: '⚽',
      iconBg: 'bg-green-500',
      change: '0 recentes',
      changeType: 'neutral'
    },
    {
      name: 'Acurácia Média',
      value: '0.0%',
      icon: '🎯',
      iconBg: 'bg-purple-500',
      change: 'Regular',
      changeType: 'neutral'
    },
    {
      name: 'Melhor Jogador',
      value: 'Matheus Ju...',
      icon: '⭐',
      iconBg: 'bg-yellow-500',
      change: 'Novo',
      changeType: 'neutral'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            🟢 Sistema Online - Temporada 2025/26
          </span>
        </div>
      </div>
      
      {/* Stats Grid - Exatamente como na imagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className={`${stat.iconBg} rounded-lg p-3 mr-4`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' :
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid com Ações Rápidas e Configurar Times lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ações Rápidas - Exatamente como na imagem */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <span className="text-xl mr-2">🚀</span>
            <h2 className="text-lg font-bold text-gray-900">Ações Rápidas</h2>
            <span className="ml-auto text-sm text-gray-500 hidden sm:block">Clique para navegar</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => onViewChange('optimizer')}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</span>
              <span className="text-sm font-medium text-blue-700 text-center">Otimizar Time</span>
              <span className="text-xs text-blue-600 mt-1">Criar escalação perfeita</span>
            </button>
            
            <button 
              onClick={() => onViewChange('history')}
              className="flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200 group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</span>
              <span className="text-sm font-medium text-green-700 text-center">Ver Histórico</span>
              <span className="text-xs text-green-600 mt-1">Times criados</span>
            </button>
            
            <button 
              onClick={() => onViewChange('players')}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-200 group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
              <span className="text-sm font-medium text-purple-700 text-center">Buscar Jogador</span>
              <span className="text-xs text-purple-600 mt-1">Explorar elencos</span>
            </button>
            
            <button 
              onClick={() => onViewChange('market')}
              className="flex flex-col items-center justify-center p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all duration-200 group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</span>
              <span className="text-sm font-medium text-orange-700 text-center">Status Mercado</span>
              <span className="text-xs text-orange-600 mt-1">Dados atuais</span>
            </button>
          </div>
        </div>

        {/* Configurar Times - Exatamente como na imagem */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <span className="text-xl mr-2">⚙️</span>
            <h2 className="text-lg font-bold text-gray-900">Configurar Times</h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => onViewChange('formation-config')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🎯</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-700">Formações Táticas</div>
                  <div className="text-xs text-blue-600">4-3-3, 4-4-2, 3-5-2...</div>
                </div>
              </div>
              <span className="text-blue-400 group-hover:text-blue-600">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('source-config')}
              className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🌐</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-green-700">Fontes de Dados</div>
                  <div className="text-xs text-green-600">APIs, sites, estatísticas</div>
                </div>
              </div>
              <span className="text-green-400 group-hover:text-green-600">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('auto-generator')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🤖</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-purple-700">Gerar Automaticamente</div>
                  <div className="text-xs text-purple-600">IA para times perfeitos</div>
                </div>
              </div>
              <span className="text-purple-400 group-hover:text-purple-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Times Recentes - se houver */}
      {recentTeams.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Times Recentes</h2>
          <div className="space-y-3">
            {recentTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div>
                    <span className="text-sm text-gray-700 font-medium">{team.name}</span>
                    <div className="text-xs text-gray-500">
                      {team.championship.name} • {team.formation} • R$ {team.totalCost.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {new Date(team.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  {team.actualResults && (
                    <div className="text-xs text-green-600 font-medium">
                      {team.actualResults.accuracy}% acerto
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Summary - se houver métricas */}
      {performanceMetrics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo de Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Melhor Acurácia</div>
              <div className="text-2xl font-bold text-green-900">{performanceMetrics.bestAccuracy}%</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Pontos Totais</div>
              <div className="text-2xl font-bold text-blue-900">{performanceMetrics.totalPointsEarned}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Times Ativos</div>
              <div className="text-2xl font-bold text-purple-900">
                {teamHistory.filter(t => t.status === 'active').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}