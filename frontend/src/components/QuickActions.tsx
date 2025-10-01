import React from 'react'

interface QuickActionsProps {
  onViewChange: (view: string) => void
}

export default function QuickActions({ onViewChange }: QuickActionsProps) {
  const actions = [
    {
      title: 'Otimizar Time',
      description: 'Criar escalação perfeita',
      icon: '⚡',
      colors: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      view: 'optimizer'
    },
    {
      title: 'Ver Histórico',
      description: 'Times criados',
      icon: '📋',
      colors: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      view: 'history'
    },
    {
      title: 'Buscar Jogador',
      description: 'Explorar elencos',
      icon: '👥',
      colors: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      view: 'players'
    },
    {
      title: 'Status Mercado',
      description: 'Dados atuais',
      icon: '📈',
      colors: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      view: 'market'
    }
  ]

  const mobileActions = [
    {
      title: 'Manual',
      icon: '📚',
      action: () => window.open('https://github.com/cristiano-superacao/Apostas_Cartola/blob/main/docs/USER_MANUAL.md', '_blank')
    },
    {
      title: 'Tela Cheia',
      icon: '🔍',
      action: () => {
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            document.documentElement.requestFullscreen()
          }
        } catch (error) {
          console.log('Fullscreen não suportado')
        }
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">
          🚀 Ações Rápidas
        </h2>
        <span className="text-xs text-gray-500 hidden sm:block">
          Clique para navegar
        </span>
      </div>
      
      {/* Main Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button 
            key={action.view}
            onClick={() => onViewChange(action.view)}
            className={`group flex flex-col items-center justify-center px-4 py-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 ${action.colors}`}
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {action.icon}
            </span>
            <span className="text-sm font-medium text-center">
              {action.title}
            </span>
            <span className="text-xs opacity-75 text-center mt-1">
              {action.description}
            </span>
          </button>
        ))}
      </div>
      
      {/* Mobile Additional Actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
        {mobileActions.map((action) => (
          <button 
            key={action.title}
            onClick={action.action}
            className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <span className="mr-2 text-sm">{action.icon}</span>
            <span className="text-xs font-medium text-gray-700">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}