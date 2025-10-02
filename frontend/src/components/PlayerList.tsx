
import { useState } from 'react'
import { Player } from '../types/championships'

import { formatCurrency } from '../lib/translations'

interface PlayerListProps {
  players: Player[]
}

export default function PlayerList({ players }: PlayerListProps) {
  // Filtro por time
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const teams = Array.from(new Set(players.map(p => p.team.name)));
  const filteredPlayers = selectedTeam ? players.filter(p => p.team.name === selectedTeam) : players;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Jogadores</h1>

      {/* Filtro por time */}
      <div className="mb-4">
        <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por time:</label>
        <select
          id="team-select"
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os times</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Jogadores</h2>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{player.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {player.position}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{player.team.name}</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(player.marketValue)}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{player.rating}</span>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(player.rating / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Scout do jogador */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-1">
                    <span>Gols: <b>{player.stats.goals}</b></span>
                    <span>Assistências: <b>{player.stats.assists}</b></span>
                    <span>Desarmes: <b>{player.stats.tackles}</b></span>
                    <span>Chutes no gol: <b>{player.stats.shotsOnTarget}</b></span>
                    <span>SG: <b>{player.stats.goalDifference ?? '-'}</b></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {player.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.team.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(player.marketValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">{player.rating}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(player.rating / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  {/* Scout do jogador na tabela */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      <span>Gols: <b>{player.stats.goals}</b></span>
                      <span>Assist: <b>{player.stats.assists}</b></span>
                      <span>Desarmes: <b>{player.stats.tackles}</b></span>
                      <span>Chutes: <b>{player.stats.shotsOnTarget}</b></span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}