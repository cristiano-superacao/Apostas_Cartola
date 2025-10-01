import { useState, useEffect, useCallback } from 'react'
import { TeamHistory, TeamPredictions, TeamResults, PerformanceMetrics } from '../types/history'
import { Player } from '../types/championships'

const STORAGE_KEY = 'supermittos_team_history'
const METRICS_KEY = 'supermittos_performance_metrics'

export const useTeamHistory = () => {
  const [teamHistory, setTeamHistory] = useState<TeamHistory[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY)
      const storedMetrics = localStorage.getItem(METRICS_KEY)
      
      if (storedHistory) {
        const history = JSON.parse(storedHistory)
        setTeamHistory(history)
      }
      
      if (storedMetrics) {
        const metrics = JSON.parse(storedMetrics)
        setPerformanceMetrics(metrics)
      } else {
        // Initialize empty metrics
        setPerformanceMetrics(initializeMetrics())
      }
    } catch (error) {
      console.error('Error loading team history:', error)
      setTeamHistory([])
      setPerformanceMetrics(initializeMetrics())
    } finally {
      setLoading(false)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamHistory))
    }
  }, [teamHistory, loading])

  useEffect(() => {
    if (!loading && performanceMetrics) {
      localStorage.setItem(METRICS_KEY, JSON.stringify(performanceMetrics))
    }
  }, [performanceMetrics, loading])

  const initializeMetrics = (): PerformanceMetrics => ({
    totalTeamsCreated: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    worstAccuracy: 0,
    totalPointsEarned: 0,
    averagePointsPerTeam: 0,
    successfulPredictions: 0,
    failedPredictions: 0,
    championshipBreakdown: {},
    formationBreakdown: {},
    monthlyPerformance: []
  })

  const generatePredictions = useCallback((players: Player[], formation: string): TeamPredictions => {
    const avgRating = players.reduce((sum, p) => sum + p.rating, 0) / players.length
    const formationBonus = formation.includes('3') ? 5 : formation.includes('5') ? -5 : 0
    const adjustedRating = avgRating + formationBonus
    const totalValue = players.reduce((sum, p) => sum + p.marketValue, 0)
    
    // Calculate expected performance based on player ratings and market values
    const expectedPoints = Math.round(adjustedRating * 0.8 + (totalValue / 1000000) * 0.1)
    const expectedGoals = Math.round(players.filter(p => ['ST', 'LW', 'RW', 'CAM'].includes(p.position)).length * 3.5)
    const expectedAssists = Math.round(players.filter(p => ['CM', 'CAM', 'LW', 'RW'].includes(p.position)).length * 2.8)
    const expectedCleanSheets = Math.round(players.filter(p => ['GK', 'CB', 'LB', 'RB', 'CDM'].includes(p.position)).length * 1.2)

    // Analyze formation strengths
    const positionCounts = players.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const strongPositions = Object.entries(positionCounts)
      .filter(([_, count]) => count >= 2)
      .map(([position]) => position)

    const weakPositions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST']
      .filter(pos => !positionCounts[pos] || positionCounts[pos] < 1)

    const keyPlayers = players
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map(p => p.name)

    // Risk assessment
    const avgAge = players.reduce((sum, p) => sum + p.age, 0) / players.length
    const riskLevel: 'low' | 'medium' | 'high' = 
      avgAge > 30 ? 'high' : 
      avgAge < 25 ? 'medium' : 'low'

    const confidence = Math.min(95, Math.max(60, avgRating + (strongPositions.length * 5) - (weakPositions.length * 10)))

    return {
      expectedPoints,
      expectedGoals,
      expectedAssists,
      expectedCleanSheets,
      riskLevel,
      confidence,
      strongPositions,
      weakPositions,
      keyPlayers
    }
  }, [])

  const saveTeam = useCallback(async (
    name: string,
    championship: any,
    formation: string,
    budget: number,
    players: Player[],
    notes?: string
  ): Promise<string> => {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const totalCost = players.reduce((sum, p) => sum + p.marketValue, 0)
    const predictions = generatePredictions(players, formation)

    const newTeam: TeamHistory = {
      id: teamId,
      name,
      championship: {
        id: championship.id,
        name: championship.name,
        season: championship.season,
        logo: championship.logo
      },
      formation,
      budget,
      totalCost,
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        team: p.team.name,
        marketValue: p.marketValue,
        rating: p.rating,
        photo: p.photo
      })),
      createdAt: new Date().toISOString(),
      predictions,
      status: 'pending',
      notes
    }

    setTeamHistory(prev => [newTeam, ...prev])
    updateMetricsAfterSave(newTeam)
    
    return teamId
  }, [generatePredictions])

  const updateMetricsAfterSave = useCallback((team: TeamHistory) => {
    setPerformanceMetrics(prev => {
      if (!prev) return initializeMetrics()

      const month = new Date(team.createdAt).toLocaleString('pt-BR', { month: 'long' })
      const year = new Date(team.createdAt).getFullYear()

      return {
        ...prev,
        totalTeamsCreated: prev.totalTeamsCreated + 1,
        championshipBreakdown: {
          ...prev.championshipBreakdown,
          [team.championship.id]: {
            championshipName: team.championship.name,
            teamsCreated: (prev.championshipBreakdown[team.championship.id]?.teamsCreated || 0) + 1,
            averageAccuracy: prev.championshipBreakdown[team.championship.id]?.averageAccuracy || 0,
            totalPoints: prev.championshipBreakdown[team.championship.id]?.totalPoints || 0,
            bestTeam: prev.championshipBreakdown[team.championship.id]?.bestTeam || team.name,
            worstTeam: prev.championshipBreakdown[team.championship.id]?.worstTeam || team.name
          }
        },
        formationBreakdown: {
          ...prev.formationBreakdown,
          [team.formation]: {
            teamsCreated: (prev.formationBreakdown[team.formation]?.teamsCreated || 0) + 1,
            averageAccuracy: prev.formationBreakdown[team.formation]?.averageAccuracy || 0,
            averagePoints: prev.formationBreakdown[team.formation]?.averagePoints || 0,
            successRate: prev.formationBreakdown[team.formation]?.successRate || 0
          }
        },
        monthlyPerformance: updateMonthlyMetrics(prev.monthlyPerformance, month, year)
      }
    })
  }, [])

  const updateMonthlyMetrics = (monthlyPerformance: any[], month: string, year: number) => {
    const existingMonth = monthlyPerformance.find(m => m.month === month && m.year === year)
    
    if (existingMonth) {
      return monthlyPerformance.map(m => 
        m.month === month && m.year === year
          ? { ...m, teamsCreated: m.teamsCreated + 1 }
          : m
      )
    } else {
      return [...monthlyPerformance, {
        month,
        year,
        teamsCreated: 1,
        averageAccuracy: 0,
        totalPoints: 0
      }]
    }
  }

  const updateTeamResults = useCallback(async (
    teamId: string,
    results: Partial<TeamResults>
  ): Promise<void> => {
    setTeamHistory(prev => prev.map(team => {
      if (team.id === teamId) {
        const updatedResults: TeamResults = {
          actualPoints: results.actualPoints || 0,
          actualGoals: results.actualGoals || 0,
          actualAssists: results.actualAssists || 0,
          actualCleanSheets: results.actualCleanSheets || 0,
          matchesPlayed: results.matchesPlayed || 0,
          accuracy: calculateAccuracy(team.predictions!, results),
          performanceByPosition: results.performanceByPosition || {},
          bestPerformers: results.bestPerformers || [],
          worstPerformers: results.worstPerformers || [],
          updatedAt: new Date().toISOString()
        }

        return {
          ...team,
          actualResults: updatedResults,
          status: 'completed' as const
        }
      }
      return team
    }))
  }, [])

  const calculateAccuracy = (predictions: TeamPredictions, results: Partial<TeamResults>): number => {
    if (!results.actualPoints && !results.actualGoals) return 0

    const pointsAccuracy = predictions.expectedPoints > 0 
      ? Math.max(0, 100 - Math.abs(predictions.expectedPoints - (results.actualPoints || 0)) * 10)
      : 0

    const goalsAccuracy = predictions.expectedGoals > 0
      ? Math.max(0, 100 - Math.abs(predictions.expectedGoals - (results.actualGoals || 0)) * 5)
      : 0

    return Math.round((pointsAccuracy + goalsAccuracy) / 2)
  }

  const deleteTeam = useCallback(async (teamId: string): Promise<void> => {
    setTeamHistory(prev => prev.filter(team => team.id !== teamId))
  }, [])

  const getTeamsByChampionship = useCallback((championshipId: string): TeamHistory[] => {
    return teamHistory.filter(team => team.championship.id === championshipId)
  }, [teamHistory])

  const getTeamsByStatus = useCallback((status: TeamHistory['status']): TeamHistory[] => {
    return teamHistory.filter(team => team.status === status)
  }, [teamHistory])

  const getRecentTeams = useCallback((limit: number = 5): TeamHistory[] => {
    return teamHistory
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }, [teamHistory])

  const getBestPerformingTeams = useCallback((limit: number = 5): TeamHistory[] => {
    return teamHistory
      .filter(team => team.actualResults?.accuracy)
      .sort((a, b) => (b.actualResults?.accuracy || 0) - (a.actualResults?.accuracy || 0))
      .slice(0, limit)
  }, [teamHistory])

  const exportHistory = useCallback((): string => {
    return JSON.stringify({
      history: teamHistory,
      metrics: performanceMetrics,
      exportedAt: new Date().toISOString()
    }, null, 2)
  }, [teamHistory, performanceMetrics])

  const importHistory = useCallback((data: string): void => {
    try {
      const imported = JSON.parse(data)
      if (imported.history && Array.isArray(imported.history)) {
        setTeamHistory(imported.history)
      }
      if (imported.metrics) {
        setPerformanceMetrics(imported.metrics)
      }
    } catch (error) {
      console.error('Error importing history:', error)
      throw new Error('Formato de dados inválido')
    }
  }, [])

  return {
    teamHistory,
    performanceMetrics,
    loading,
    saveTeam,
    updateTeamResults,
    deleteTeam,
    getTeamsByChampionship,
    getTeamsByStatus,
    getRecentTeams,
    getBestPerformingTeams,
    exportHistory,
    importHistory
  }
}