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
      <h1 className="text-3xl font-bold text-gray-900">Otimizador de Time</h1>
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orçamento
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              <option value="4-3-3">4-3-3</option>
              <option value="4-4-2">4-4-2</option>
              <option value="3-5-2">3-5-2</option>
              <option value="5-3-2">5-3-2</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={optimizeTeam}
              disabled={isOptimizing}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? 'Otimizando...' : 'Otimizar Time'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {optimizedTeam.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Otimizado</h2>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Custo Total</div>
              <div className="text-2xl font-bold text-green-900">€{totalCost.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Rating Médio</div>
              <div className="text-2xl font-bold text-blue-900">{avgRating.toFixed(1)}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Formação</div>
              <div className="text-2xl font-bold text-purple-900">{formation}</div>
            </div>
          </div>

          {/* Team List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jogador
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
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {player.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{player.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}