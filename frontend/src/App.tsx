import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import PlayerList from './components/PlayerList'
import TeamOptimizer from './components/TeamOptimizer'
import MarketStatus from './components/MarketStatus'
import { getPlayers, getDashboardData } from './lib/api'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [players, setPlayers] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [playersData, dashData] = await Promise.all([
          getPlayers(),
          getDashboardData()
        ])
        setPlayers(playersData)
        setDashboardData(dashData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dados...</div>
        </div>
      )
    }

    switch (currentView) {
      case 'players':
        return <PlayerList players={players} />
      case 'optimizer':
        return <TeamOptimizer players={players} />
      case 'market':
        return <MarketStatus />
      default:
        return <Dashboard data={dashboardData} />
    }
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </Layout>
  )
}

export default App