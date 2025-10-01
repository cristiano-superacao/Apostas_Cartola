import { useState } from 'react'
import { useTeamHistory } from '../hooks/useTeamHistory'
import { Championship } from '../types/championships'
import { TeamPredictions } from '../types/history'

interface Player {
  id: number
  name: string
  position: string
  team: string
  price: number
  rating: number
  marketValue?: number
}

interface TeamOptimizerProps {
  players: Player[]
  championship?: Championship
}

export default function TeamOptimizer({ players, championship }: TeamOptimizerProps) {
  const [budget, setBudget] = useState(100000000) // 100M
  const [formation, setFormation] = useState('4-3-3')
  const [optimizedTeam, setOptimizedTeam] = useState<Player[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { saveTeam } = useTeamHistory()

  const optimizeTeam = async () => {
    setIsOptimizing(true)
    
    // Simular otimização
    setTimeout(() => {
      const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating)
      const team = sortedPlayers.slice(0, 11)
      setOptimizedTeam(team)
      setIsOptimizing(false)
    }, 2000)
  }

  const generatePredictions = (team: Player[]): TeamPredictions => {
    const avgRating = team.reduce((sum, player) => sum + player.rating, 0) / team.length
    const basePoints = Math.round(avgRating * 1.2)
    
    // Calcular previsões baseadas no rating médio e formação
    const formationMultipliers: Record<string, { attack: number; defense: number; midfield: number }> = {
      '4-3-3': { attack: 1.3, defense: 0.9, midfield: 1.0 },
      '4-4-2': { attack: 1.1, defense: 1.0, midfield: 1.2 },
      '3-5-2': { attack: 1.0, defense: 0.8, midfield: 1.4 },
      '5-3-2': { attack: 0.8, defense: 1.3, midfield: 1.0 }
    }

    const multiplier = formationMultipliers[formation] || formationMultipliers['4-3-3']
    
    const expectedGoals = Math.round((avgRating / 10) * multiplier.attack * (Math.random() * 0.4 + 0.8))
    const expectedAssists = Math.round((avgRating / 12) * multiplier.midfield * (Math.random() * 0.4 + 0.8))
    const expectedPoints = Math.round(basePoints * (multiplier.attack + multiplier.defense + multiplier.midfield) / 3)
    
    // Calcular confiança baseada na qualidade e custo do time
    const totalCost = team.reduce((sum, player) => sum + (player.marketValue || player.price), 0)
    const budgetUtilization = totalCost / budget
    const confidence = Math.min(95, Math.round(avgRating + (budgetUtilization * 20)))
    
    // Determinar nível de risco
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
    if (confidence >= 80) riskLevel = 'low'
    else if (confidence <= 60) riskLevel = 'high'

    return {
      expectedPoints,
      expectedGoals,
      expectedAssists,
      confidence,
      riskLevel,
      notes: `Previsão baseada no rating médio de ${avgRating.toFixed(1)} e formação ${formation}`
    }
  }

  const handleSaveTeam = async () => {
    if (!championship || optimizedTeam.length === 0) {
      alert('Selecione um campeonato e otimize um time antes de salvar!')
      return
    }

    if (!teamName.trim()) {
      alert('Digite um nome para o time!')
      return
    }

    setIsSaving(true)
    
    try {
      const predictions = generatePredictions(optimizedTeam)
      const totalCost = optimizedTeam.reduce((sum, player) => sum + (player.marketValue || player.price), 0)
      
      const teamData = {
        name: teamName.trim(),
        championship,
        formation,
        budget,
        totalCost,
        players: optimizedTeam.map(player => ({
          id: player.id,
          name: player.name,
          position: player.position,
          team: player.team,
          rating: player.rating,
          marketValue: player.marketValue || player.price
        })),
        predictions,
        status: 'active' as const
      }

      await saveTeam(teamData)
      
      // Reset form
      setTeamName('')
      setShowSaveModal(false)
      
      alert('Time salvo com sucesso! Você pode acompanhar o progresso no Histórico.')
    } catch (error) {
      console.error('Erro ao salvar time:', error)
      alert('Erro ao salvar o time. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const totalCost = optimizedTeam.reduce((sum, player) => sum + (player.marketValue || player.price), 0)
  const avgRating = optimizedTeam.length > 0 
    ? optimizedTeam.reduce((sum, player) => sum + player.rating, 0) / optimizedTeam.length 
    : 0

  const predictions = optimizedTeam.length > 0 ? generatePredictions(optimizedTeam) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Otimizador de Time</h1>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            🧠 IA Ativa
          </span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Configurações</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orçamento (€)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formação
            </label>
            <select
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="4-3-3">4-3-3 (Ofensivo)</option>
              <option value="4-4-2">4-4-2 (Equilibrado)</option>
              <option value="3-5-2">3-5-2 (Meio-campo)</option>
              <option value="5-3-2">5-3-2 (Defensivo)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={optimizeTeam}
              disabled={isOptimizing}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Otimizando...
                </>
              ) : (
                <>
                  <span className="mr-2">⚡</span>
                  Otimizar Time
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {optimizedTeam.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Time Otimizado</h2>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Custo Total</div>
              <div className="text-xl lg:text-2xl font-bold text-green-900">€{totalCost.toLocaleString()}</div>
              <div className="text-xs text-green-700 mt-1">
                {((totalCost / budget) * 100).toFixed(1)}% do orçamento
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Rating Médio</div>
              <div className="text-xl lg:text-2xl font-bold text-blue-900">{avgRating.toFixed(1)}</div>
              <div className="text-xs text-blue-700 mt-1">
                ⭐ Excelente qualidade
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Formação</div>
              <div className="text-xl lg:text-2xl font-bold text-purple-900">{formation}</div>
              <div className="text-xs text-purple-700 mt-1">
                {optimizedTeam.length} jogadores
              </div>
            </div>
            {predictions && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-600 font-medium">Pontos Esperados</div>
                <div className="text-xl lg:text-2xl font-bold text-orange-900">{predictions.expectedPoints}</div>
                <div className="text-xs text-orange-700 mt-1">
                  {predictions.confidence}% confiança
                </div>
              </div>
            )}
          </div>

          {/* Predictions Summary */}
          {predictions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">🔮</span>
                Previsões de Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{predictions.expectedGoals}</div>
                  <div className="text-sm text-blue-600">Gols esperados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{predictions.expectedAssists}</div>
                  <div className="text-sm text-blue-600">Assistências esperadas</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    predictions.riskLevel === 'low' ? 'text-green-900' :
                    predictions.riskLevel === 'medium' ? 'text-yellow-900' : 'text-red-900'
                  }`}>
                    {predictions.riskLevel === 'low' ? 'Baixo' :
                     predictions.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                  </div>
                  <div className="text-sm text-blue-600">Nível de risco</div>
                </div>
              </div>
              <p className="text-sm text-blue-700 italic">{predictions.notes}</p>
            </div>
          )}

          {/* Save Team Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!championship}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2">💾</span>
              Salvar Time no Histórico
            </button>
            {!championship && (
              <p className="mt-2 text-sm text-red-600">
                Selecione um campeonato para salvar o time
              </p>
            )}
          </div>

          {/* Mobile Team List */}
          <div className="lg:hidden space-y-3 mb-6">
            <h3 className="text-base font-semibold text-gray-900">Jogadores Selecionados</h3>
            {optimizedTeam.map((player) => (
              <div key={player.id} className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 truncate">{player.name}</h4>
                  <span className="text-sm font-medium text-green-600 flex-shrink-0 ml-2">
                    €{player.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {player.position}
                    </span>
                    <span className="text-gray-600 text-xs">{player.team}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">⭐</span>
                    <span className="font-medium text-gray-900">{player.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Team List */}
          <div className="hidden lg:block overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jogadores Selecionados</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jogador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {optimizedTeam.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{player.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{player.team}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {player.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-1">⭐</span>
                          <span className="text-sm font-medium text-gray-900">{player.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          €{(player.marketValue || player.price).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formation Visualization */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-center">
              <div className="text-sm font-medium text-green-800 mb-2">
                Visualização da Formação {formation}
              </div>
              <div className="h-32 sm:h-40 lg:h-48 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="text-green-600 text-sm">
                  ⚽ Campo de futebol com formação {formation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-blue-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Dicas de Otimização
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>O algoritmo prioriza jogadores com melhor rating dentro do orçamento</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Diferentes formações podem alterar a prioridade das posições</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Ajuste o orçamento para explorar diferentes combinações</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Salve seus times para acompanhar o desempenho real no histórico</span>
          </li>
        </ul>
      </div>

      {/* Save Team Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Salvar Time</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>Campeonato:</span>
                  <span className="font-medium">{championship?.name || 'Não selecionado'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formação:</span>
                  <span className="font-medium">{formation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jogadores:</span>
                  <span className="font-medium">{optimizedTeam.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custo Total:</span>
                  <span className="font-medium">€{totalCost.toLocaleString()}</span>
                </div>
                {predictions && (
                  <div className="flex justify-between">
                    <span>Pontos Esperados:</span>
                    <span className="font-medium">{predictions.expectedPoints}</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handleSaveTeam()
            }} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Time
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Meu Time Brasileiro 2024"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Dê um nome único para identificar este time no histórico
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !teamName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Time'}
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <strong>Ao salvar:</strong> O time será adicionado ao histórico com previsões de performance. 
                    Você poderá atualizar os resultados reais posteriormente para acompanhar a acurácia das análises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}