import { useState } from 'react'

interface AutoGeneratorProps {
  onViewChange: (view: string) => void
}

interface GenerationConfig {
  budget: number
  formation: string
  style: string
  championship: string
  prioritizePositions: string[]
  constraints: {
    maxAge: number
    minRating: number
    sameTeamLimit: number
    includeNewcomers: boolean
    prioritizeForm: boolean
  }
}

export default function AutoGenerator({ onViewChange }: AutoGeneratorProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    budget: 100,
    formation: '4-3-3',
    style: 'Equilibrado',
    championship: 'brasileiro-serie-a',
    prioritizePositions: [],
    constraints: {
      maxAge: 35,
      minRating: 70,
      sameTeamLimit: 3,
      includeNewcomers: true,
      prioritizeForm: true
    }
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTeams, setGeneratedTeams] = useState<any[]>([])

  const formations = [
    { value: '4-3-3', label: '4-3-3 Clássico', positions: { gk: 1, def: 4, mid: 3, att: 3 } },
    { value: '4-4-2', label: '4-4-2 Equilibrado', positions: { gk: 1, def: 4, mid: 4, att: 2 } },
    { value: '3-5-2', label: '3-5-2 Meio-Campo', positions: { gk: 1, def: 3, mid: 5, att: 2 } },
    { value: '4-2-3-1', label: '4-2-3-1 Moderno', positions: { gk: 1, def: 4, mid: 5, att: 1 } },
    { value: '5-3-2', label: '5-3-2 Defensivo', positions: { gk: 1, def: 5, mid: 3, att: 2 } },
    { value: '4-1-4-1', label: '4-1-4-1 Contra-Ataque', positions: { gk: 1, def: 4, mid: 5, att: 1 } }
  ]

  const championships = [
    { value: 'brasileiro-serie-a', label: 'Brasileirão Série A 2025' },
    { value: 'premier-league', label: 'Premier League 2025/26' },
    { value: 'champions-league', label: 'Champions League 2025/26' },
    { value: 'la-liga', label: 'LaLiga 2025/26' }
  ]

  const styles = ['Ofensivo', 'Equilibrado', 'Defensivo', 'Meio-Campo', 'Contra-Ataque']
  const positions = ['Goleiro', 'Zagueiro', 'Meio-Campo', 'Atacante']

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simular geração de times (aqui você integraria com a IA/algoritmo real)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockTeams = [
      {
        id: 1,
        name: `Time IA ${config.formation}`,
        formation: config.formation,
        totalCost: config.budget * 0.95,
        expectedPoints: Math.floor(Math.random() * 50) + 50,
        risk: 'Baixo',
        players: [] // Aqui viriam os jogadores selecionados
      },
      {
        id: 2,
        name: `Time Alternativo ${config.formation}`,
        formation: config.formation,
        totalCost: config.budget * 0.88,
        expectedPoints: Math.floor(Math.random() * 45) + 45,
        risk: 'Médio',
        players: []
      },
      {
        id: 3,
        name: `Time Conservador ${config.formation}`,
        formation: config.formation,
        totalCost: config.budget * 0.82,
        expectedPoints: Math.floor(Math.random() * 40) + 40,
        risk: 'Baixo',
        players: []
      }
    ]
    
    setGeneratedTeams(mockTeams)
    setIsGenerating(false)
  }

  const handleSaveTeam = (team: any) => {
    // Salvar time gerado
    const savedTeams = JSON.parse(localStorage.getItem('generated-teams') || '[]')
    savedTeams.push({
      ...team,
      createdAt: new Date().toISOString(),
      source: 'auto-generator'
    })
    localStorage.setItem('generated-teams', JSON.stringify(savedTeams))
    
    alert(`✅ Time "${team.name}" salvo com sucesso!`)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">🤖 Gerador Automático de Times</h1>
          <p className="text-gray-600 mt-2">Configure os parâmetros e deixe a IA criar times perfeitos para você</p>
        </div>
        <button
          onClick={() => onViewChange('dashboard')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Configurações Básicas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Configurações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento (Cartoletas)
                </label>
                <input
                  type="number"
                  value={config.budget}
                  onChange={(e) => setConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="50"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formação Tática
                </label>
                <select
                  value={config.formation}
                  onChange={(e) => setConfig(prev => ({ ...prev, formation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {formations.map(formation => (
                    <option key={formation.value} value={formation.value}>
                      {formation.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de Jogo
                </label>
                <select
                  value={config.style}
                  onChange={(e) => setConfig(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campeonato
                </label>
                <select
                  value={config.championship}
                  onChange={(e) => setConfig(prev => ({ ...prev, championship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {championships.map(championship => (
                    <option key={championship.value} value={championship.value}>
                      {championship.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Restrições Avançadas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Restrições e Preferências</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade Máxima
                </label>
                <input
                  type="number"
                  value={config.constraints.maxAge}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, maxAge: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="18"
                  max="45"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Mínimo
                </label>
                <input
                  type="number"
                  value={config.constraints.minRating}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, minRating: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="50"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jogadores do Mesmo Time (máx)
                </label>
                <input
                  type="number"
                  value={config.constraints.sameTeamLimit}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, sameTeamLimit: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="8"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.constraints.includeNewcomers}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, includeNewcomers: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Incluir jogadores novatos/promissores
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.constraints.prioritizeForm}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, prioritizeForm: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Priorizar jogadores em boa forma
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorizar Posições (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {positions.map(position => (
                  <button
                    key={position}
                    onClick={() => {
                      setConfig(prev => ({
                        ...prev,
                        prioritizePositions: prev.prioritizePositions.includes(position)
                          ? prev.prioritizePositions.filter(p => p !== position)
                          : [...prev.prioritizePositions, position]
                      }))
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      config.prioritizePositions.includes(position)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Botão de Geração */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Gerar Times</h3>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gerando...
                </div>
              ) : (
                '🤖 Gerar Times com IA'
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              A IA analisará milhares de combinações para encontrar os melhores times
            </p>
          </div>

          {/* Resumo da Configuração */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Orçamento:</span>
                <span className="font-medium">{config.budget} cartoletas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Formação:</span>
                <span className="font-medium">{config.formation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estilo:</span>
                <span className="font-medium">{config.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Idade máx:</span>
                <span className="font-medium">{config.constraints.maxAge} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating mín:</span>
                <span className="font-medium">{config.constraints.minRating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Times Gerados */}
      {generatedTeams.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Times Gerados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedTeams.map((team) => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    team.risk === 'Baixo' ? 'bg-green-100 text-green-700' :
                    team.risk === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {team.risk}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-medium">{team.totalCost.toFixed(1)} C$</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pontos esperados:</span>
                    <span className="font-medium text-green-600">{team.expectedPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formação:</span>
                    <span className="font-medium">{team.formation}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveTeam(team)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    💾 Salvar
                  </button>
                  <button
                    onClick={() => onViewChange('optimizer')}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}