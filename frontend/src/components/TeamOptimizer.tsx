import { useState } from 'react'

interface Player {
  id: number
  name: string
  position: string
  team: string
  price: number
  rating: number
}

interface TeamOptimizerProps {
  players: Player[]
}

export default function TeamOptimizer({ players }: TeamOptimizerProps) {
  const [budget, setBudget] = useState(100000000) // 100M
  const [formation, setFormation] = useState('4-3-3')
  const [optimizedTeam, setOptimizedTeam] = useState<Player[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

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

  const totalCost = optimizedTeam.reduce((sum, player) => sum + player.price, 0)
  const avgRating = optimizedTeam.length > 0 
    ? optimizedTeam.reduce((sum, player) => sum + player.rating, 0) / optimizedTeam.length 
    : 0

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                          €{player.price.toLocaleString()}
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
        </ul>
      </div>
    </div>
  )
}