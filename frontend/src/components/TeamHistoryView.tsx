import { useState } from 'react'
import { useTeamHistory } from '../hooks/useTeamHistory'
import { TeamHistory } from '../types/history'
import UpdateResultsModal from './UpdateResultsModal'

interface TeamHistoryViewProps {
  championship?: any
}

export default function TeamHistoryView({ championship }: TeamHistoryViewProps) {
  const {
    teamHistory,
    performanceMetrics,
    loading,
    deleteTeam,
    getTeamsByChampionship,
    getRecentTeams,
    getBestPerformingTeams,
    updateTeamResults,
    exportHistory
  } = useTeamHistory()

  const [activeTab, setActiveTab] = useState<'recent' | 'best' | 'all' | 'stats'>('recent')
  const [selectedTeam, setSelectedTeam] = useState<TeamHistory | null>(null)
  const [filterChampionship, setFilterChampionship] = useState<string>('')
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [teamToUpdate, setTeamToUpdate] = useState<TeamHistory | null>(null)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getDisplayedTeams = (): TeamHistory[] => {
    let teams = teamHistory

    if (filterChampionship) {
      teams = getTeamsByChampionship(filterChampionship)
    }

    switch (activeTab) {
      case 'recent':
        return getRecentTeams(10)
      case 'best':
        return getBestPerformingTeams(10)
      case 'all':
        return teams
      default:
        return teams
    }
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  const getStatusBadge = (status: TeamHistory['status']) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    const labels = {
      pending: 'Pendente',
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getAccuracyBadge = (accuracy?: number) => {
    if (!accuracy) return null

    const color = accuracy >= 80 ? 'green' : accuracy >= 60 ? 'yellow' : 'red'
    const bgClass = `bg-${color}-100 text-${color}-800`

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass}`}>
        {accuracy}% acerto
      </span>
    )
  }

  const handleExport = () => {
    const data = exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supermittos_history_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUpdateResults = async (teamId: string, results: any) => {
    try {
      await updateTeamResults(teamId, results)
      setShowUpdateModal(false)
      setTeamToUpdate(null)
    } catch (error) {
      console.error('Erro ao atualizar resultados:', error)
      alert('Erro ao atualizar resultados. Tente novamente.')
    }
  }

  const displayedTeams = getDisplayedTeams()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Histórico de Times</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Times Criados</div>
                <div className="text-2xl font-bold text-gray-900">{performanceMetrics.totalTeamsCreated}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Acurácia Média</div>
                <div className="text-2xl font-bold text-gray-900">{performanceMetrics.averageAccuracy.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏆</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Melhor Acurácia</div>
                <div className="text-2xl font-bold text-gray-900">{performanceMetrics.bestAccuracy}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚽</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Pontos Totais</div>
                <div className="text-2xl font-bold text-gray-900">{performanceMetrics.totalPointsEarned}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'recent', label: 'Recentes', icon: '🕒' },
              { key: 'best', label: 'Melhores', icon: '🏆' },
              { key: 'all', label: 'Todos', icon: '📋' },
              { key: 'stats', label: 'Estatísticas', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'stats' ? (
            /* Statistics View */
            <div className="space-y-6">
              {/* Championship Breakdown */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho por Campeonato</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(performanceMetrics?.championshipBreakdown || {}).map(([id, data]) => (
                    <div key={id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{data.championshipName}</h4>
                        <span className="text-sm text-gray-500">{data.teamsCreated} times</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Acurácia:</span>
                          <span className="ml-1 font-medium">{data.averageAccuracy.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pontos:</span>
                          <span className="ml-1 font-medium">{data.totalPoints}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formation Breakdown */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho por Formação</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(performanceMetrics?.formationBreakdown || {}).map(([formation, data]) => (
                    <div key={formation} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{formation}</h4>
                        <span className="text-sm text-gray-500">{data.teamsCreated} times</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Acurácia:</span>
                          <span className="ml-1 font-medium">{data.averageAccuracy.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Taxa de Sucesso:</span>
                          <span className="ml-1 font-medium">{data.successRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Teams List */
            <>
              {displayedTeams.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum time encontrado</h3>
                  <p className="text-gray-500">
                    {activeTab === 'recent' 
                      ? 'Você ainda não criou nenhum time. Vá para o Otimizador para criar seu primeiro time!'
                      : 'Nenhum time corresponde aos filtros selecionados.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedTeams.map((team) => (
                    <div
                      key={team.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                            {getStatusBadge(team.status)}
                            {team.actualResults && getAccuracyBadge(team.actualResults.accuracy)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <span className="mr-1">{team.championship.logo}</span>
                              {team.championship.name}
                            </span>
                            <span>•</span>
                            <span>{team.formation}</span>
                            <span>•</span>
                            <span>{formatCurrency(team.totalCost)}</span>
                            <span>•</span>
                            <span>{new Date(team.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>

                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-1">Jogadores:</span>
                              <span className="font-medium">{team.players.length}</span>
                            </div>
                            {team.predictions && (
                              <>
                                <div className="flex items-center">
                                  <span className="text-gray-500 mr-1">Pontos esperados:</span>
                                  <span className="font-medium">{team.predictions.expectedPoints}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-gray-500 mr-1">Confiança:</span>
                                  <span className="font-medium">{team.predictions.confidence}%</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                          {!team.actualResults && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setTeamToUpdate(team)
                                setShowUpdateModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Atualizar Resultados"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm('Tem certeza que deseja excluir este time?')) {
                                deleteTeam(team.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedTeam.name}</h3>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informações do Time</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Campeonato:</dt>
                      <dd className="font-medium">{selectedTeam.championship.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Formação:</dt>
                      <dd className="font-medium">{selectedTeam.formation}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Orçamento:</dt>
                      <dd className="font-medium">{formatCurrency(selectedTeam.budget)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Custo Total:</dt>
                      <dd className="font-medium">{formatCurrency(selectedTeam.totalCost)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Criado em:</dt>
                      <dd className="font-medium">{new Date(selectedTeam.createdAt).toLocaleString('pt-BR')}</dd>
                    </div>
                  </dl>
                </div>

                {/* Predictions */}
                {selectedTeam.predictions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Previsões</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Pontos esperados:</dt>
                        <dd className="font-medium">{selectedTeam.predictions.expectedPoints}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Gols esperados:</dt>
                        <dd className="font-medium">{selectedTeam.predictions.expectedGoals}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Assistências:</dt>
                        <dd className="font-medium">{selectedTeam.predictions.expectedAssists}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Confiança:</dt>
                        <dd className="font-medium">{selectedTeam.predictions.confidence}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Nível de risco:</dt>
                        <dd className={`font-medium ${
                          selectedTeam.predictions.riskLevel === 'low' ? 'text-green-600' :
                          selectedTeam.predictions.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedTeam.predictions.riskLevel === 'low' ? 'Baixo' :
                           selectedTeam.predictions.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              {/* Players List */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Jogadores ({selectedTeam.players.length})</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {selectedTeam.players.map((player) => (
                    <div key={player.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{player.position}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.team} • {formatCurrency(player.marketValue)}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {player.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actual Results */}
              {selectedTeam.actualResults && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Resultados Reais</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-900">{selectedTeam.actualResults.actualPoints}</div>
                      <div className="text-xs text-green-600">Pontos obtidos</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-900">{selectedTeam.actualResults.actualGoals}</div>
                      <div className="text-xs text-blue-600">Gols marcados</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-purple-900">{selectedTeam.actualResults.actualAssists}</div>
                      <div className="text-xs text-purple-600">Assistências</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-orange-900">{selectedTeam.actualResults.accuracy}%</div>
                      <div className="text-xs text-orange-600">Acurácia</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Results Modal */}
      {showUpdateModal && teamToUpdate && (
        <UpdateResultsModal
          team={teamToUpdate}
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false)
            setTeamToUpdate(null)
          }}
          onUpdate={handleUpdateResults}
        />
      )}
    </div>
  )
}