
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🟢 Sistema Online
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Times Recentes</h2>
        {recentTeams.length > 0 ? (
          <div className="space-y-3">
            {recentTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
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
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Resumo de Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Quick Actions */}
      <QuickActions onViewChange={onViewChange} />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="mr-2">⚡</span>
            <span className="text-sm font-medium text-blue-700">Otimizar Time</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <span className="mr-2">�</span>
            <span className="text-sm font-medium text-green-700">Ver Histórico</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="mr-2">👥</span>
            <span className="text-sm font-medium text-purple-700">Buscar Jogador</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <span className="mr-2">📈</span>
            <span className="text-sm font-medium text-yellow-700">Status Mercado</span>
          </button>
        </div>
      </div>
    </div>
  )
}