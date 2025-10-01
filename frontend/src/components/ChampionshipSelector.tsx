import { useState, useEffect } from 'react'
import { Championship, AVAILABLE_CHAMPIONSHIPS } from '../types/championships'

interface ChampionshipSelectorProps {
  selectedChampionship: Championship | null
  onChampionshipChange: (championship: Championship) => void
  className?: string
}

export default function ChampionshipSelector({ 
  selectedChampionship, 
  onChampionshipChange,
  className = ""
}: ChampionshipSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChampionships = AVAILABLE_CHAMPIONSHIPS.filter(champ =>
    champ.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    champ.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeChampionships = filteredChampionships.filter(champ => champ.active)
  const inactiveChampionships = filteredChampionships.filter(champ => !champ.active)

  const handleSelect = (championship: Championship) => {
    onChampionshipChange(championship)
    setIsOpen(false)
    setSearchTerm('')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.championship-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`championship-selector relative ${className}`}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedChampionship ? (
            <>
              <span className="text-2xl">{selectedChampionship.logo}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">{selectedChampionship.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedChampionship.country} • {selectedChampionship.season}
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="text-2xl">🏟️</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Selecionar Campeonato</div>
                <div className="text-sm text-gray-500">Escolha um campeonato para analisar</div>
              </div>
            </>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar campeonato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Championships List */}
          <div className="max-h-80 overflow-y-auto">
            {/* Active Championships */}
            {activeChampionships.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  Campeonatos Ativos ({activeChampionships.length})
                </div>
                {activeChampionships.map((championship) => (
                  <button
                    key={championship.id}
                    onClick={() => handleSelect(championship)}
                    className={`w-full flex items-center px-3 py-3 hover:bg-blue-50 transition-colors ${
                      selectedChampionship?.id === championship.id ? 'bg-blue-100 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <span className="text-2xl mr-3">{championship.logo}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{championship.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <span>{championship.country}</span>
                        <span>•</span>
                        <span>{championship.season}</span>
                        <span>•</span>
                        <span>{championship.teams} times</span>
                        {championship.currentRound && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              Rodada {championship.currentRound}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedChampionship?.id === championship.id && (
                      <div className="text-blue-500 ml-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Inactive Championships */}
            {inactiveChampionships.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  Temporadas Anteriores ({inactiveChampionships.length})
                </div>
                {inactiveChampionships.map((championship) => (
                  <button
                    key={championship.id}
                    onClick={() => handleSelect(championship)}
                    className="w-full flex items-center px-3 py-3 hover:bg-gray-50 transition-colors opacity-60"
                  >
                    <span className="text-2xl mr-3 grayscale">{championship.logo}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-600">{championship.name}</div>
                      <div className="text-sm text-gray-400 flex items-center space-x-2">
                        <span>{championship.country}</span>
                        <span>•</span>
                        <span>{championship.season}</span>
                        <span>•</span>
                        <span>Finalizado</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredChampionships.length === 0 && (
              <div className="px-3 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <div className="font-medium">Nenhum campeonato encontrado</div>
                <div className="text-sm">Tente buscar por outro termo</div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {selectedChampionship && (
            <div className="p-3 bg-blue-50 border-t border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Campeonato Selecionado</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{selectedChampionship.teams}</div>
                  <div className="text-blue-600">Times</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-900">
                    {selectedChampionship.currentRound || 'N/A'}
                  </div>
                  <div className="text-blue-600">Rodada</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-900">{selectedChampionship.season}</div>
                  <div className="text-blue-600">Temporada</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}