import { useTeamHistory } from '../hooks/useTeamHistory'
import { Championship } from '../types/championships'
import QuickActions from './QuickActions'

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

  const stats = [
    {
      name: 'Total de Jogadores',
      value: data.totalPlayers,
      icon: '👥',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Times Criados',
      value: performanceMetrics?.totalTeamsCreated || 0,
      icon: '⚽',
      color: 'bg-green-500',
      change: `${recentTeams.length} recentes`,
      changeType: 'neutral'
    },
    {
      name: 'Acurácia Média',
      value: performanceMetrics ? `${performanceMetrics.averageAccuracy.toFixed(1)}%` : 'N/A',
      icon: '🎯',
      color: 'bg-purple-500',
      change: performanceMetrics && performanceMetrics.averageAccuracy >= 70 ? 'Excelente' : 'Regular',
      changeType: performanceMetrics && performanceMetrics.averageAccuracy >= 70 ? 'increase' : 'neutral'
    },
    {
      name: 'Melhor Jogador',
      value: data.topPlayer,
      icon: '⭐',
      color: 'bg-yellow-500',
      change: 'Novo',
      changeType: 'neutral'
    }
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            🟢 Sistema Online - Temporada 2025/26
          </span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-4 lg:p-6 card-hover">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-2 lg:p-3 mr-3 lg:mr-4`}>
                <span className="text-white text-lg lg:text-2xl">{stat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                <p className={`text-xs font-medium ${
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

      {/* Configurações e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions onViewChange={onViewChange} />
        
        {/* Sistema de Configuração */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">⚙️ Configurar Times</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onViewChange('formation-config')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">🎯</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-700">Formações Táticas</div>
                  <div className="text-xs text-blue-600">4-3-3, 4-4-2, 3-5-2...</div>
                </div>
              </div>
              <span className="text-blue-400 group-hover:text-blue-600">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('source-config')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">🌐</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-green-700">Fontes de Dados</div>
                  <div className="text-xs text-green-600">APIs, sites, estatísticas</div>
                </div>
              </div>
              <span className="text-green-400 group-hover:text-green-600">→</span>
            </button>
            
            <button 
              onClick={() => onViewChange('auto-generator')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">🤖</span>
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

      {/* Times Recentes e Performance em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Times Recentes</h2>
          {recentTeams.length > 0 ? (
            <div className="space-y-3">
              {recentTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div>
                      <span className="text-sm lg:text-base text-gray-700 font-medium">{team.name}</span>
                      <div className="text-xs text-gray-500">
                        {team.championship.name} • {team.formation} • R$ {team.totalCost.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xs lg:text-sm text-gray-500">
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
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">⚽</div>
              <p className="text-gray-500 text-sm">
                Nenhum time criado ainda. Vá para o Otimizador para criar seu primeiro time!
              </p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        {performanceMetrics && (
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
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
    </div>
  )
}