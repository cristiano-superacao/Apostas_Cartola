import { useState } from 'react'

interface SourceConfigProps {
  onViewChange: (view: string) => void
}

interface DataSource {
  id: string
  name: string
  type: 'api' | 'website' | 'database'
  description: string
  features: string[]
  status: 'active' | 'inactive' | 'premium'
  icon: string
  url?: string
}

const AVAILABLE_SOURCES: DataSource[] = [
  {
    id: 'cartola-fc',
    name: 'Cartola FC',
    type: 'api',
    description: 'API oficial do Cartola FC com dados em tempo real',
    features: ['Preços atualizados', 'Pontuações', 'Status dos jogadores', 'Scout detalhado'],
    status: 'active',
    icon: '⚽',
    url: 'https://api.cartolafc.globo.com'
  },
  {
    id: 'brasileirao-cbf',
    name: 'CBF - Brasileirão',
    type: 'api',
    description: 'Dados oficiais da Confederação Brasileira de Futebol',
    features: ['Escalações oficiais', 'Resultados', 'Estatísticas', 'Tabela'],
    status: 'active',
    icon: '🇧🇷',
    url: 'https://api.cbf.com.br'
  },
  {
    id: 'sofascore',
    name: 'SofaScore',
    type: 'website',
    description: 'Plataforma com estatísticas detalhadas de jogadores',
    features: ['Ratings', 'Estatísticas avançadas', 'Histórico', 'Comparações'],
    status: 'active',
    icon: '📊',
    url: 'https://www.sofascore.com'
  },
  {
    id: 'transfermarkt',
    name: 'Transfermarkt',
    type: 'website',
    description: 'Valores de mercado e informações de transferências',
    features: ['Valores de mercado', 'Histórico de transferências', 'Idades', 'Nacionalidades'],
    status: 'active',
    icon: '💰',
    url: 'https://www.transfermarkt.com.br'
  },
  {
    id: 'footstats',
    name: 'FootStats',
    type: 'api',
    description: 'API especializada em estatísticas de futebol',
    features: ['Estatísticas detalhadas', 'Análise preditiva', 'Tendências', 'Comparações'],
    status: 'premium',
    icon: '🎯',
    url: 'https://api.footstats.org'
  },
  {
    id: 'opta-sports',
    name: 'Opta Sports',
    type: 'api',
    description: 'Dados profissionais usados por clubes e mídia',
    features: ['Dados profissionais', 'Análises avançadas', 'Expected Goals', 'Heat maps'],
    status: 'premium',
    icon: '🏆',
    url: 'https://www.optasports.com'
  },
  {
    id: 'local-database',
    name: 'Base Local',
    type: 'database',
    description: 'Dados armazenados localmente para uso offline',
    features: ['Acesso offline', 'Dados históricos', 'Personalizável', 'Backup local'],
    status: 'active',
    icon: '💾'
  },
  {
    id: 'ge-globo',
    name: 'GloboEsporte',
    type: 'website',
    description: 'Portal de notícias e dados do GloboEsporte',
    features: ['Notícias', 'Escalações', 'Resultados', 'Tabelas'],
    status: 'active',
    icon: '📰',
    url: 'https://globoesporte.globo.com'
  }
]

export default function SourceConfig({ onViewChange }: SourceConfigProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(['cartola-fc', 'brasileirao-cbf', 'local-database'])
  const [priorityOrder, setPriorityOrder] = useState<string[]>(['cartola-fc', 'brasileirao-cbf', 'local-database'])
  const [updateFrequency, setUpdateFrequency] = useState<string>('15min')

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => {
      const newSources = prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
      
      // Atualizar ordem de prioridade
      setPriorityOrder(prevOrder => {
        if (newSources.includes(sourceId) && !prevOrder.includes(sourceId)) {
          return [...prevOrder, sourceId]
        }
        return prevOrder.filter(id => newSources.includes(id))
      })
      
      return newSources
    })
  }

  const movePriority = (sourceId: string, direction: 'up' | 'down') => {
    setPriorityOrder(prev => {
      const currentIndex = prev.indexOf(sourceId)
      if (currentIndex === -1) return prev
      
      const newOrder = [...prev]
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      if (newIndex < 0 || newIndex >= newOrder.length) return prev
      
      // Trocar posições
      const temp = newOrder[currentIndex]
      newOrder[currentIndex] = newOrder[newIndex]
      newOrder[newIndex] = temp
      return newOrder
    })
  }

  const handleSaveConfiguration = () => {
    const config = {
      selectedSources,
      priorityOrder,
      updateFrequency,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('source-config', JSON.stringify(config))
    
    alert('✅ Configurações de fontes salvas com sucesso!')
    onViewChange('dashboard')
  }

  const getSourceById = (id: string) => AVAILABLE_SOURCES.find(s => s.id === id)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">🌐 Configurar Fontes de Dados</h1>
          <p className="text-gray-600 mt-2">Escolha de onde obter informações dos jogadores e times</p>
        </div>
        <button
          onClick={() => onViewChange('dashboard')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Configurações Gerais */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações de Atualização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência de Atualização
            </label>
            <select
              value={updateFrequency}
              onChange={(e) => setUpdateFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5min">A cada 5 minutos</option>
              <option value="15min">A cada 15 minutos</option>
              <option value="30min">A cada 30 minutos</option>
              <option value="1hour">A cada 1 hora</option>
              <option value="manual">Apenas manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fontes Selecionadas
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {selectedSources.length} / {AVAILABLE_SOURCES.length}
            </div>
            <p className="text-sm text-gray-500">fontes ativas</p>
          </div>
        </div>
      </div>

      {/* Ordem de Prioridade */}
      {selectedSources.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ordem de Prioridade</h2>
          <p className="text-gray-600 mb-4">Arraste ou use as setas para definir a ordem de consulta das fontes</p>
          
          <div className="space-y-2">
            {priorityOrder.map((sourceId, index) => {
              const source = getSourceById(sourceId)
              if (!source) return null
              
              return (
                <div key={sourceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => movePriority(sourceId, 'up')}
                        disabled={index === 0}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => movePriority(sourceId, 'down')}
                        disabled={index === priorityOrder.length - 1}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <span className="text-2xl">{source.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{source.name}</h3>
                      <p className="text-sm text-gray-500">{source.type}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    source.status === 'active' ? 'bg-green-100 text-green-700' :
                    source.status === 'premium' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {source.status}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Fontes Disponíveis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Fontes Disponíveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_SOURCES.map((source) => {
            const isSelected = selectedSources.includes(source.id)
            
            return (
              <div
                key={source.id}
                onClick={() => handleSourceToggle(source.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {source.status === 'premium' && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    Premium
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{source.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{source.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{source.type}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{source.description}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Recursos:</h4>
                  <div className="flex flex-wrap gap-1">
                    {source.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {source.url && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {source.url}
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <button
          onClick={() => {
            setSelectedSources(['cartola-fc', 'brasileirao-cbf', 'local-database'])
            setPriorityOrder(['cartola-fc', 'brasileirao-cbf', 'local-database'])
            setUpdateFrequency('15min')
          }}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Restaurar Padrão
        </button>
        <button
          onClick={handleSaveConfiguration}
          disabled={selectedSources.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          💾 Salvar Configurações
        </button>
      </div>
    </div>
  )
}