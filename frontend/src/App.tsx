import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import PlayerList from './components/PlayerList'
import TeamOptimizer from './components/TeamOptimizer'
import MarketStatus from './components/MarketStatus'
import ChampionshipSelector from './components/ChampionshipSelector'
import TeamHistoryView from './components/TeamHistoryView'
import Loading from './components/Loading'
import ErrorBoundary from './components/ErrorBoundary'
import { useChampionshipData } from './hooks/useChampionshipData'
import { getPlayers, getDashboardData } from './lib/api'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use championship data hook
  const {
    selectedChampionship,
    championshipData,
    loading: championshipLoading,
    error: championshipError,
    changeChampionship,
    getTopPlayers
  } = useChampionshipData()

  // Legacy data for fallback
  const [players, setPlayers] = useState([])
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const loadFallbackData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [playersData, dashData] = await Promise.all([
          getPlayers(),
          getDashboardData()
        ])
        setPlayers(playersData)
        setDashboardData(dashData)
      } catch (error) {
        console.error('Erro ao carregar dados de fallback:', error)
        setError('Erro ao carregar dados. Usando dados offline.')
      } finally {
        setLoading(false)
      }
    }

    loadFallbackData()
  }, [])

  const renderContent = () => {
    if (loading || championshipLoading) {
      return <Loading message="Carregando dados do SuperMittos..." size="lg" />
    }

    if (error || championshipError) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error || championshipError}</p>
            </div>
          </div>
        </div>
      )
    }

    // Use championship data if available, fallback to legacy data
    const currentPlayers = championshipData?.players || players
    const currentDashData = championshipData ? {
      totalPlayers: championshipData.players.length,
      activeOffers: championshipData.teams.length * 2,
      avgPrice: Math.round(championshipData.players.reduce((sum, p) => sum + p.marketValue, 0) / championshipData.players.length),
      topPlayer: getTopPlayers(1)[0]?.name || 'N/A'
    } : dashboardData

    switch (currentView) {
      case 'players':
        return <PlayerList players={currentPlayers} championship={selectedChampionship} />
      case 'optimizer':
        return <TeamOptimizer players={currentPlayers} championship={selectedChampionship} />
      case 'market':
        return <MarketStatus championship={selectedChampionship} />
      case 'history':
        return <TeamHistoryView championship={selectedChampionship} />
      default:
        return <Dashboard data={currentDashData} championship={selectedChampionship} />
    }
  }

  return (
    <ErrorBoundary>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {/* Championship Selector */}
        <div className="mb-6">
          <ChampionshipSelector
            selectedChampionship={selectedChampionship}
            onChampionshipChange={changeChampionship}
          />
        </div>

        {(error || championshipError) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error || championshipError}</p>
              </div>
            </div>
          </div>
        )}
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  )
}

export default App