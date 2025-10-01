import { useState } from 'react'

interface FormationConfigProps {
  onViewChange: (view: string) => void
}

interface Formation {
  id: string
  name: string
  system: string
  description: string
  positions: {
    gk: number
    def: number
    mid: number
    att: number
  }
  style: string
  icon: string
}

const AVAILABLE_FORMATIONS: Formation[] = [
  {
    id: '4-3-3',
    name: '4-3-3 Clássico',
    system: '4-3-3',
    description: 'Formação ofensiva com 3 atacantes',
    positions: { gk: 1, def: 4, mid: 3, att: 3 },
    style: 'Ofensivo',
    icon: '⚽'
  },
  {
    id: '4-4-2',
    name: '4-4-2 Equilibrado',
    system: '4-4-2',
    description: 'Formação equilibrada com dupla de ataque',
    positions: { gk: 1, def: 4, mid: 4, att: 2 },
    style: 'Equilibrado',
    icon: '🔄'
  },
  {
    id: '3-5-2',
    name: '3-5-2 Meio-Campo',
    system: '3-5-2',
    description: 'Domínio do meio-campo com alas',
    positions: { gk: 1, def: 3, mid: 5, att: 2 },
    style: 'Meio-Campo',
    icon: '🎯'
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 Moderno',
    system: '4-2-3-1',
    description: 'Formação moderna com falso 9',
    positions: { gk: 1, def: 4, mid: 5, att: 1 },
    style: 'Moderno',
    icon: '🚀'
  },
  {
    id: '5-3-2',
    name: '5-3-2 Defensivo',
    system: '5-3-2',
    description: 'Formação defensiva sólida',
    positions: { gk: 1, def: 5, mid: 3, att: 2 },
    style: 'Defensivo',
    icon: '🛡️'
  },
  {
    id: '4-1-4-1',
    name: '4-1-4-1 Contra-Ataque',
    system: '4-1-4-1',
    description: 'Ideal para contra-ataques rápidos',
    positions: { gk: 1, def: 4, mid: 5, att: 1 },
    style: 'Contra-Ataque',
    icon: '⚡'
  }
]

export default function FormationConfig({ onViewChange }: FormationConfigProps) {
  const [selectedFormations, setSelectedFormations] = useState<string[]>(['4-3-3', '4-4-2'])
  const [preferredStyle, setPreferredStyle] = useState<string>('Equilibrado')

  const handleFormationToggle = (formationId: string) => {
    setSelectedFormations(prev => 
      prev.includes(formationId)
        ? prev.filter(id => id !== formationId)
        : [...prev, formationId]
    )
  }

  const handleSaveConfiguration = () => {
    // Salvar configurações no localStorage
    const config = {
      selectedFormations,
      preferredStyle,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('formation-config', JSON.stringify(config))
    
    // Mostrar notificação de sucesso
    alert('✅ Configurações salvas com sucesso!')
    onViewChange('dashboard')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">🎯 Configurar Formações</h1>
          <p className="text-gray-600 mt-2">Escolha as formações táticas que você prefere usar</p>
        </div>
        <button
          onClick={() => onViewChange('dashboard')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Estilo Preferido */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Estilo de Jogo Preferido</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Ofensivo', 'Equilibrado', 'Defensivo', 'Meio-Campo', 'Contra-Ataque'].map((style) => (
            <button
              key={style}
              onClick={() => setPreferredStyle(style)}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                preferredStyle === style
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Formações Disponíveis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Formações Disponíveis</h2>
          <div className="text-sm text-gray-500">
            {selectedFormations.length} selecionadas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_FORMATIONS.map((formation) => {
            const isSelected = selectedFormations.includes(formation.id)
            const isRecommended = formation.style === preferredStyle

            return (
              <div
                key={formation.id}
                onClick={() => handleFormationToggle(formation.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Recomendado
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{formation.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{formation.name}</h3>
                      <p className="text-sm text-gray-600">{formation.system}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{formation.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex space-x-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      GK: {formation.positions.gk}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      DEF: {formation.positions.def}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      MID: {formation.positions.mid}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      ATT: {formation.positions.att}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    formation.style === 'Ofensivo' ? 'bg-red-100 text-red-700' :
                    formation.style === 'Equilibrado' ? 'bg-blue-100 text-blue-700' :
                    formation.style === 'Defensivo' ? 'bg-green-100 text-green-700' :
                    formation.style === 'Meio-Campo' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {formation.style}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <button
          onClick={() => setSelectedFormations(['4-3-3', '4-4-2'])}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Restaurar Padrão
        </button>
        <button
          onClick={handleSaveConfiguration}
          disabled={selectedFormations.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          💾 Salvar Configurações
        </button>
      </div>
    </div>
  )
}