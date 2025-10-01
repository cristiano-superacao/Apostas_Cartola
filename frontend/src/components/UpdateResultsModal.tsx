import { useState } from 'react'

import { TeamHistory } from '../types/history'

interface UpdateResultsModalProps {
  team: TeamHistory
  isOpen: boolean
  onClose: () => void
  onUpdate: (teamId: string, results: any) => void
}

export default function UpdateResultsModal({ team, isOpen, onClose, onUpdate }: UpdateResultsModalProps) {
  const [actualPoints, setActualPoints] = useState(team.actualResults?.actualPoints || 0)
  const [actualGoals, setActualGoals] = useState(team.actualResults?.actualGoals || 0)
  const [actualAssists, setActualAssists] = useState(team.actualResults?.actualAssists || 0)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const results = {
        actualPoints,
        actualGoals,
        actualAssists,
        updatedAt: new Date().toISOString()
      }

      await onUpdate(team.id, results)
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar resultados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAccuracy = () => {
    if (!team.predictions) return 0

    const pointsAccuracy = team.predictions.expectedPoints > 0 
      ? Math.min((actualPoints / team.predictions.expectedPoints) * 100, 100)
      : 0

    const goalsAccuracy = team.predictions.expectedGoals > 0
      ? Math.min((actualGoals / team.predictions.expectedGoals) * 100, 100)
      : 0

    const assistsAccuracy = team.predictions.expectedAssists > 0
      ? Math.min((actualAssists / team.predictions.expectedAssists) * 100, 100)
      : 0

    return Math.round((pointsAccuracy + goalsAccuracy + assistsAccuracy) / 3)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Atualizar Resultados</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">{team.name}</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex justify-between">
              <span>Campeonato:</span>
              <span>{team.championship.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Criado em:</span>
              <span>{new Date(team.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {team.predictions && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Previsões vs Realidade</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Pontos</span>
                  <span className="text-sm font-medium">Esperado: {team.predictions.expectedPoints}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Atual: {actualPoints}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Gols</span>
                  <span className="text-sm font-medium">Esperado: {team.predictions.expectedGoals}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Atual: {actualGoals}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Assistências</span>
                  <span className="text-sm font-medium">Esperado: {team.predictions.expectedAssists}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Atual: {actualAssists}</span>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-medium">Acurácia Estimada</span>
                  <span className="text-lg font-bold text-green-900">{calculateAccuracy()}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="actualPoints" className="block text-sm font-medium text-gray-700 mb-1">
              Pontos Reais
            </label>
            <input
              type="number"
              id="actualPoints"
              min="0"
              value={actualPoints}
              onChange={(e) => setActualPoints(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 85"
            />
          </div>

          <div>
            <label htmlFor="actualGoals" className="block text-sm font-medium text-gray-700 mb-1">
              Gols Reais
            </label>
            <input
              type="number"
              id="actualGoals"
              min="0"
              value={actualGoals}
              onChange={(e) => setActualGoals(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 12"
            />
          </div>

          <div>
            <label htmlFor="actualAssists" className="block text-sm font-medium text-gray-700 mb-1">
              Assistências Reais
            </label>
            <input
              type="number"
              id="actualAssists"
              min="0"
              value={actualAssists}
              onChange={(e) => setActualAssists(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 8"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Resultados'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Dica:</strong> Os resultados são salvos automaticamente e usados para calcular sua acurácia geral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}