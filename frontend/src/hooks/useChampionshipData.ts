import { useState, useEffect, useCallback } from 'react'
import { Championship, ChampionshipData, Team, Player, AVAILABLE_CHAMPIONSHIPS } from '../types/championships'

// Mock data generator for realistic football data
const generateMockPlayers = (championship: Championship, teams: Team[]): Player[] => {
  const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST']
  const players: Player[] = []

  teams.forEach(team => {
    // Generate realistic squad size (23-30 players per team)
    const squadSize = Math.floor(Math.random() * 8) + 23

    for (let i = 0; i < squadSize; i++) {
      const position = positions[Math.floor(Math.random() * positions.length)]
      const age = Math.floor(Math.random() * 15) + 18 // 18-32 years
      
      // Position-based market value ranges (in millions)
      let baseValue = 5
      if (position === 'GK') baseValue = 8
      else if (['ST', 'CAM', 'LW', 'RW'].includes(position)) baseValue = 15
      else if (['CM', 'CDM'].includes(position)) baseValue = 12
      else if (['CB', 'LB', 'RB'].includes(position)) baseValue = 10

      // Age factor for market value
      const ageFactor = age <= 23 ? 1.5 : age >= 30 ? 0.6 : 1.0
      const marketValue = Math.floor(baseValue * ageFactor * (Math.random() * 3 + 0.5)) * 1000000

      // Rating based on market value and randomization
      const baseRating = Math.min(95, Math.max(60, 70 + (marketValue / 10000000) + Math.random() * 10))

      players.push({
        id: players.length + 1,
        name: generatePlayerName(),
        position,
        age,
        nationality: getRandomNationality(championship.country),
        team,
        championship: championship.id,
        marketValue,
        rating: Math.round(baseRating),
        stats: generatePlayerStats(position, baseRating),
        photo: `https://via.placeholder.com/150x150?text=${position}`
      })
    }
  })

  return players
}

const generatePlayerName = (): string => {
  const firstNames = [
    'Gabriel', 'Pedro', 'Bruno', 'Rafael', 'Lucas', 'João', 'Matheus', 'Felipe', 'Carlos', 'Diego',
    'Cristiano', 'Lionel', 'Kylian', 'Erling', 'Neymar', 'Robert', 'Kevin', 'Mohamed', 'Sadio', 'Virgil',
    'Harry', 'Marcus', 'Raheem', 'Jadon', 'Phil', 'Mason', 'Bukayo', 'Declan', 'Jack', 'Jordan',
    'Vinicius', 'Rodrygo', 'Eduardo', 'Antony', 'Casemiro', 'Fred', 'Fabinho', 'Alisson', 'Thiago'
  ]
  
  const lastNames = [
    'Silva', 'Santos', 'Oliveira', 'Pereira', 'Lima', 'Costa', 'Rodrigues', 'Fernandes', 'Alves', 'Ribeiro',
    'Ronaldo', 'Messi', 'Mbappé', 'Haaland', 'Jr', 'Lewandowski', 'De Bruyne', 'Salah', 'Mané', 'van Dijk',
    'Kane', 'Rashford', 'Sterling', 'Sancho', 'Foden', 'Mount', 'Saka', 'Rice', 'Grealish', 'Henderson',
    'Junior', 'Goes', 'Militão', 'Casemiro', 'Silva', 'Moura', 'Becker', 'Alcântara'
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${firstName} ${lastName}`
}

const getRandomNationality = (championshipCountry: string): string => {
  const nationalitiesByRegion: { [key: string]: string[] } = {
    'Brasil': ['Brasil', 'Argentina', 'Uruguai', 'Colômbia', 'Chile', 'Peru'],
    'Inglaterra': ['Inglaterra', 'França', 'Espanha', 'Brasil', 'Argentina', 'Alemanha'],
    'Europa': ['França', 'Espanha', 'Alemanha', 'Inglaterra', 'Brasil', 'Argentina', 'Portugal', 'Itália'],
    'Espanha': ['Espanha', 'Brasil', 'Argentina', 'França', 'Portugal', 'Inglaterra'],
    'Itália': ['Itália', 'Brasil', 'Argentina', 'França', 'Espanha', 'Inglaterra'],
    'Alemanha': ['Alemanha', 'Brasil', 'França', 'Inglaterra', 'Espanha', 'Polônia'],
    'França': ['França', 'Brasil', 'Argentina', 'Espanha', 'Inglaterra', 'Alemanha'],
    'América do Sul': ['Brasil', 'Argentina', 'Uruguai', 'Colômbia', 'Chile', 'Peru', 'Equador', 'Paraguai']
  }

  const nationalities = nationalitiesByRegion[championshipCountry] || ['Brasil', 'Argentina', 'França', 'Espanha']
  return nationalities[Math.floor(Math.random() * nationalities.length)]
}

const generatePlayerStats = (position: string, rating: number) => {
  const baseStats = {
    appearances: Math.floor(Math.random() * 25) + 5,
    goals: 0,
    assists: 0,
    yellowCards: Math.floor(Math.random() * 5),
    redCards: Math.random() < 0.1 ? 1 : 0,
    minutesPlayed: 0,
    passAccuracy: Math.floor(rating * 0.8 + Math.random() * 20),
    shotsOnTarget: 0,
    tackles: 0,
    interceptions: 0
  }

  baseStats.minutesPlayed = baseStats.appearances * (Math.floor(Math.random() * 40) + 50)

  // Position-specific stats
  if (['ST', 'LW', 'RW'].includes(position)) {
    baseStats.goals = Math.floor(Math.random() * 15) + 2
    baseStats.assists = Math.floor(Math.random() * 8) + 1
    baseStats.shotsOnTarget = Math.floor(Math.random() * 30) + 10
  } else if (['CAM', 'CM'].includes(position)) {
    baseStats.goals = Math.floor(Math.random() * 8) + 1
    baseStats.assists = Math.floor(Math.random() * 12) + 3
    baseStats.shotsOnTarget = Math.floor(Math.random() * 20) + 5
  } else if (['CDM', 'CB', 'LB', 'RB'].includes(position)) {
    baseStats.goals = Math.floor(Math.random() * 3)
    baseStats.assists = Math.floor(Math.random() * 5) + 1
    baseStats.tackles = Math.floor(Math.random() * 50) + 20
    baseStats.interceptions = Math.floor(Math.random() * 40) + 15
  } else if (position === 'GK') {
    baseStats.goals = 0
    baseStats.assists = Math.floor(Math.random() * 2)
    baseStats.tackles = 0
    baseStats.interceptions = Math.floor(Math.random() * 20) + 5
  }

  return baseStats
}

const generateMockTeams = (championship: Championship): Team[] => {
  const teamNamesByChampionship: { [key: string]: string[] } = {
    'brasileiro-serie-a': [
      'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Atlético-MG', 'Internacional',
      'Grêmio', 'Santos', 'Fluminense', 'Vasco da Gama', 'Botafogo', 'Cruzeiro',
      'Bahia', 'Sport', 'Ceará', 'Fortaleza', 'Atlético-GO', 'Cuiabá', 'Bragantino', 'América-MG'
    ],
    'premier-league': [
      'Manchester City', 'Arsenal', 'Liverpool', 'Manchester United', 'Newcastle United', 'Brighton',
      'Aston Villa', 'Tottenham', 'Brentford', 'Fulham', 'Crystal Palace', 'Chelsea',
      'Wolverhampton', 'West Ham United', 'Everton', 'Nottingham Forest', 'Leicester City', 
      'Leeds United', 'Bournemouth', 'Southampton'
    ],
    'la-liga': [
      'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Real Sociedad', 'Villarreal', 'Real Betis',
      'Athletic Bilbao', 'Valencia', 'Sevilla', 'Celta Vigo', 'Osasuna', 'Getafe',
      'Mallorca', 'Girona', 'Las Palmas', 'Alaves', 'Rayo Vallecano', 'Espanyol', 'Valladolid', 'Almeria'
    ],
    'serie-a': [
      'Napoli', 'AC Milan', 'Inter Milan', 'Juventus', 'Atalanta', 'AS Roma',
      'Lazio', 'Fiorentina', 'Torino', 'Udinese', 'Sassuolo', 'Bologna',
      'Empoli', 'Monza', 'Lecce', 'Salernitana', 'Spezia', 'Cremonese', 'Sampdoria', 'Hellas Verona'
    ],
    'bundesliga': [
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Union Berlin', 'SC Freiburg', 'Bayer Leverkusen',
      'Eintracht Frankfurt', 'VfL Wolfsburg', 'Mainz 05', 'Borussia Mönchengladbach', '1. FC Köln', 'Augsburg',
      'VfB Stuttgart', 'Werder Bremen', 'TSG Hoffenheim', 'VfL Bochum', 'FC Schalke 04', 'Hertha BSC'
    ],
    'ligue-1': [
      'Paris Saint-Germain', 'RC Lens', 'Marseille', 'AS Monaco', 'Rennes', 'Lille',
      'Lyon', 'Nice', 'Clermont Foot', 'Montpellier', 'Strasbourg', 'Nantes',
      'Lorient', 'Reims', 'Toulouse', 'Troyes', 'Ajaccio', 'Auxerre'
    ]
  }

  let teamNames = teamNamesByChampionship[championship.id] || []
  
  // For Champions League, mix teams from different leagues
  if (championship.id === 'champions-league') {
    teamNames = [
      'Real Madrid', 'Barcelona', 'Manchester City', 'Liverpool', 'Bayern Munich', 'PSG',
      'AC Milan', 'Inter Milan', 'Juventus', 'Napoli', 'Borussia Dortmund', 'RB Leipzig',
      'Arsenal', 'Manchester United', 'Atlético Madrid', 'Porto', 'Benfica', 'Ajax',
      'Celtic', 'Shakhtar Donetsk', 'Salzburg', 'Copenhagen', 'Galatasaray', 'Sevilla',
      'Real Sociedad', 'Newcastle United', 'AC Milan', 'Lazio', 'PSV', 'Lens', 'Union Berlin', 'Antwerp'
    ].slice(0, 32)
  }

  if (championship.id === 'copa-libertadores') {
    teamNames = [
      'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Atlético-MG', 'Internacional',
      'Grêmio', 'Santos', 'Fluminense', 'Botafogo', 'River Plate', 'Boca Juniors',
      'Racing', 'Independiente', 'Nacional', 'Peñarol', 'Colo-Colo', 'Universidad de Chile',
      'Estudiantes', 'San Lorenzo', 'Olimpia', 'Cerro Porteño', 'Barcelona SC', 'Emelec',
      'Sporting Cristal', 'Universitario', 'Millonarios', 'Santa Fe', 'Caracas FC', 'Deportivo Táchira'
    ]
  }

  return teamNames.slice(0, championship.teams).map((name, index) => ({
    id: index + 1,
    name,
    shortName: name.split(' ')[0],
    logo: `https://via.placeholder.com/64x64?text=${name.charAt(0)}`,
    championship: championship.id,
    founded: Math.floor(Math.random() * 100) + 1900,
    country: championship.country,
    venue: {
      name: `${name} Stadium`,
      capacity: Math.floor(Math.random() * 50000) + 20000,
      city: championship.country === 'Brasil' ? 'São Paulo' : 'London'
    }
  }))
}

export const useChampionshipData = () => {
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null)
  const [championshipData, setChampionshipData] = useState<ChampionshipData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadChampionshipData = useCallback(async (championship: Championship) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock data
      const teams = generateMockTeams(championship)
      const players = generateMockPlayers(championship, teams)
      
      const data: ChampionshipData = {
        championship,
        teams,
        players
      }
      
      setChampionshipData(data)
      setSelectedChampionship(championship)
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedChampionship', JSON.stringify(championship))
      localStorage.setItem(`championshipData_${championship.id}`, JSON.stringify(data))
      
    } catch (err) {
      setError('Erro ao carregar dados do campeonato')
      console.error('Error loading championship data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const changeChampionship = useCallback((championship: Championship) => {
    // Check if data is already cached
    const cachedData = localStorage.getItem(`championshipData_${championship.id}`)
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData)
        setChampionshipData(data)
        setSelectedChampionship(championship)
        localStorage.setItem('selectedChampionship', JSON.stringify(championship))
        return
      } catch (e) {
        // If cache is corrupted, reload
        console.warn('Corrupted cache data, reloading...')
      }
    }
    
    loadChampionshipData(championship)
  }, [loadChampionshipData])

  const getPlayersByTeam = useCallback((teamId: number): Player[] => {
    if (!championshipData) return []
    return championshipData.players.filter(player => player.team.id === teamId)
  }, [championshipData])

  const getPlayersByPosition = useCallback((position: string): Player[] => {
    if (!championshipData) return []
    return championshipData.players.filter(player => player.position === position)
  }, [championshipData])

  const getTopPlayers = useCallback((limit: number = 10): Player[] => {
    if (!championshipData) return []
    return [...championshipData.players]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }, [championshipData])

  const searchPlayers = useCallback((query: string): Player[] => {
    if (!championshipData || !query.trim()) return []
    
    const searchTerm = query.toLowerCase()
    return championshipData.players.filter(player =>
      player.name.toLowerCase().includes(searchTerm) ||
      player.team.name.toLowerCase().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm) ||
      player.nationality.toLowerCase().includes(searchTerm)
    )
  }, [championshipData])

  // Initialize with cached data on mount
  useEffect(() => {
    const cachedChampionship = localStorage.getItem('selectedChampionship')
    if (cachedChampionship) {
      try {
        const championship = JSON.parse(cachedChampionship)
        const cachedData = localStorage.getItem(`championshipData_${championship.id}`)
        if (cachedData) {
          const data = JSON.parse(cachedData)
          setChampionshipData(data)
          setSelectedChampionship(championship)
        } else {
          loadChampionshipData(championship)
        }
      } catch (e) {
        // If cache is corrupted, start fresh
        console.warn('Corrupted cache, starting fresh')
        setSelectedChampionship(AVAILABLE_CHAMPIONSHIPS[0])
        loadChampionshipData(AVAILABLE_CHAMPIONSHIPS[0])
      }
    } else {
      // Default to Brazilian Championship
      setSelectedChampionship(AVAILABLE_CHAMPIONSHIPS[0])
      loadChampionshipData(AVAILABLE_CHAMPIONSHIPS[0])
    }
  }, [loadChampionshipData])

  return {
    selectedChampionship,
    championshipData,
    loading,
    error,
    changeChampionship,
    getPlayersByTeam,
    getPlayersByPosition,
    getTopPlayers,
    searchPlayers,
    availableChampionships: AVAILABLE_CHAMPIONSHIPS
  }
}