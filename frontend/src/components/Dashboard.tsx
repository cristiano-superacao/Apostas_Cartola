import { useEffect, useState } from 'react'

interface DashboardData {
  totalPlayers: number
  activeOffers: number
  avgPrice: number
  topPlayer: string
}

interface DashboardProps {
  data: DashboardData | null
}

export default function Dashboard({ data }: DashboardProps) {
  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-gray-500">Carregando dados...</div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total de Jogadores',
      value: data.totalPlayers,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      name: 'Ofertas Ativas',
      value: data.activeOffers,
      icon: '📈',
      color: 'bg-green-500'
    },
    {
      name: 'Preço Médio',
      value: `€${data.avgPrice.toLocaleString()}`,
      icon: '💰',
      color: 'bg-yellow-500'
    },
    {
      name: 'Melhor Jogador',
      value: data.topPlayer,
      icon: '⭐',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6 card-hover">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <span className="text-white text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Novo jogador adicionado: Cristiano Ronaldo</span>
            <span className="text-sm text-gray-500">2 min atrás</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">Oferta atualizada: Lionel Messi</span>
            <span className="text-sm text-gray-500">5 min atrás</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Time otimizado gerado</span>
            <span className="text-sm text-gray-500">10 min atrás</span>
          </div>
        </div>
      </div>
    </div>
  )
}