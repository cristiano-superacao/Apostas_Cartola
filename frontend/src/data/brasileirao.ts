// Dados realistas do Brasileirão Série A 2024
export const brasileiraoTeams = [
  {
    id: 1,
    name: 'Flamengo',
    shortName: 'FLA',
    city: 'Rio de Janeiro',
    founded: 1895,
    stadium: 'Maracanã',
    colors: ['#E30613', '#000000'],
    marketValue: 180_000_000, // R$ 180 milhões
    titles: 8
  },
  {
    id: 2,
    name: 'Palmeiras',
    shortName: 'PAL',
    city: 'São Paulo',
    founded: 1914,
    stadium: 'Allianz Parque',
    colors: ['#006600', '#FFFFFF'],
    marketValue: 175_000_000,
    titles: 11
  },
  {
    id: 3,
    name: 'São Paulo',
    shortName: 'SAO',
    city: 'São Paulo',
    founded: 1930,
    stadium: 'Morumbi',
    colors: ['#FF0000', '#000000', '#FFFFFF'],
    marketValue: 120_000_000,
    titles: 6
  },
  {
    id: 4,
    name: 'Corinthians',
    shortName: 'COR',
    city: 'São Paulo',
    founded: 1910,
    stadium: 'Neo Química Arena',
    colors: ['#000000', '#FFFFFF'],
    marketValue: 115_000_000,
    titles: 7
  },
  {
    id: 5,
    name: 'Atlético-MG',
    shortName: 'CAM',
    city: 'Belo Horizonte',
    founded: 1908,
    stadium: 'Arena MRV',
    colors: ['#000000', '#FFFFFF'],
    marketValue: 110_000_000,
    titles: 3
  },
  {
    id: 6,
    name: 'Fluminense',
    shortName: 'FLU',
    city: 'Rio de Janeiro',
    founded: 1902,
    stadium: 'Maracanã',
    colors: ['#800020', '#FFFFFF', '#006600'],
    marketValue: 95_000_000,
    titles: 4
  },
  {
    id: 7,
    name: 'Botafogo',
    shortName: 'BOT',
    city: 'Rio de Janeiro',
    founded: 1904,
    stadium: 'Nilton Santos',
    colors: ['#000000', '#FFFFFF'],
    marketValue: 85_000_000,
    titles: 3
  },
  {
    id: 8,
    name: 'Internacional',
    shortName: 'INT',
    city: 'Porto Alegre',
    founded: 1909,
    stadium: 'Beira-Rio',
    colors: ['#FF0000', '#FFFFFF'],
    marketValue: 80_000_000,
    titles: 3
  },
  {
    id: 9,
    name: 'Grêmio',
    shortName: 'GRE',
    city: 'Porto Alegre',
    founded: 1903,
    stadium: 'Arena do Grêmio',
    colors: ['#0066CC', '#000000', '#FFFFFF'],
    marketValue: 75_000_000,
    titles: 2
  },
  {
    id: 10,
    name: 'Vasco da Gama',
    shortName: 'VAS',
    city: 'Rio de Janeiro',
    founded: 1898,
    stadium: 'São Januário',
    colors: ['#000000', '#FFFFFF'],
    marketValue: 70_000_000,
    titles: 4
  },
  {
    id: 11,
    name: 'Cruzeiro',
    shortName: 'CRU',
    city: 'Belo Horizonte',
    founded: 1921,
    stadium: 'Mineirão',
    colors: ['#0066CC', '#FFFFFF'],
    marketValue: 65_000_000,
    titles: 4
  },
  {
    id: 12,
    name: 'Bahia',
    shortName: 'BAH',
    city: 'Salvador',
    founded: 1931,
    stadium: 'Arena Fonte Nova',
    colors: ['#0066CC', '#FF0000', '#FFFFFF'],
    marketValue: 60_000_000,
    titles: 2
  },
  {
    id: 13,
    name: 'Athletico-PR',
    shortName: 'CAP',
    city: 'Curitiba',
    founded: 1924,
    stadium: 'Ligga Arena',
    colors: ['#FF0000', '#000000'],
    marketValue: 55_000_000,
    titles: 1
  },
  {
    id: 14,
    name: 'Bragantino',
    shortName: 'RBB',
    city: 'Bragança Paulista',
    founded: 1928,
    stadium: 'Nabi Abi Chedid',
    colors: ['#FFFFFF', '#FF0000'],
    marketValue: 50_000_000,
    titles: 0
  },
  {
    id: 15,
    name: 'Fortaleza',
    shortName: 'FOR',
    city: 'Fortaleza',
    founded: 1918,
    stadium: 'Castelão',
    colors: ['#0066CC', '#FF0000', '#FFFFFF'],
    marketValue: 45_000_000,
    titles: 0
  },
  {
    id: 16,
    name: 'Juventude',
    shortName: 'JUV',
    city: 'Caxias do Sul',
    founded: 1913,
    stadium: 'Alfredo Jaconi',
    colors: ['#006600', '#FFFFFF'],
    marketValue: 40_000_000,
    titles: 0
  },
  {
    id: 17,
    name: 'Criciúma',
    shortName: 'CRI',
    city: 'Criciúma',
    founded: 1947,
    stadium: 'Heriberto Hülse',
    colors: ['#FFFF00', '#000000'],
    marketValue: 35_000_000,
    titles: 0
  },
  {
    id: 18,
    name: 'Vitória',
    shortName: 'VIT',
    city: 'Salvador',
    founded: 1899,
    stadium: 'Barradão',
    colors: ['#FF0000', '#000000'],
    marketValue: 30_000_000,
    titles: 0
  },
  {
    id: 19,
    name: 'Cuiabá',
    shortName: 'CUI',
    city: 'Cuiabá',
    founded: 2001,
    stadium: 'Arena Pantanal',
    colors: ['#006600', '#FFFF00'],
    marketValue: 25_000_000,
    titles: 0
  },
  {
    id: 20,
    name: 'Atlético-GO',
    shortName: 'ACG',
    city: 'Goiânia',
    founded: 1937,
    stadium: 'Antônio Accioly',
    colors: ['#FF0000', '#000000'],
    marketValue: 20_000_000,
    titles: 0
  }
]

// Nomes brasileiros realistas
export const brazilianNames = {
  firstNames: [
    'Gabriel', 'João', 'Pedro', 'Lucas', 'Matheus', 'Rafael', 'Bruno', 'Guilherme',
    'Felipe', 'Eduardo', 'Carlos', 'André', 'Diego', 'Vinícius', 'Thiago', 'Rodrigo',
    'Fernando', 'Marcelo', 'Leonardo', 'Gustavo', 'Daniel', 'Victor', 'Henrique', 'Igor',
    'Arthur', 'Caio', 'Renan', 'Fabio', 'Alex', 'Leandro', 'Wesley', 'Yuri', 'Kevin',
    'Jean', 'Richard', 'Robson', 'Everton', 'Patrick', 'Nicolas', 'Jonathan', 'William',
    'Luiz', 'José', 'Antônio', 'Francisco', 'Paulo', 'Roberto', 'Márcio', 'Sérgio'
  ],
  lastNames: [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
    'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro', 'Mendes',
    'Cardoso', 'Ramos', 'Araujo', 'Nascimento', 'Correia', 'Teixeira', 'Reis', 'Freitas',
    'Miranda', 'Campos', 'Pinto', 'Moreira', 'Cavalcanti', 'Amaral', 'Machado', 'Castro'
  ]
}

// Valores de mercado por posição (em reais)
export const positionMarketValues = {
  GK: { min: 500_000, max: 15_000_000, avg: 3_000_000 },
  DEF: { min: 800_000, max: 25_000_000, avg: 5_000_000 },
  MID: { min: 1_000_000, max: 35_000_000, avg: 8_000_000 },
  ATT: { min: 1_500_000, max: 50_000_000, avg: 12_000_000 }
}

// Idades típicas por posição
export const positionAges = {
  GK: { min: 20, max: 40, avg: 28 },
  DEF: { min: 18, max: 38, avg: 26 },
  MID: { min: 18, max: 36, avg: 25 },
  ATT: { min: 17, max: 35, avg: 24 }
}

// Ratings típicos por posição
export const positionRatings = {
  GK: { min: 65, max: 90, avg: 75 },
  DEF: { min: 60, max: 88, avg: 72 },
  MID: { min: 62, max: 92, avg: 74 },
  ATT: { min: 58, max: 95, avg: 73 }
}

export const generateBrazilianPlayer = (teamId: number, position: string): any => {
  const firstName = brazilianNames.firstNames[Math.floor(Math.random() * brazilianNames.firstNames.length)]
  const lastName = brazilianNames.lastNames[Math.floor(Math.random() * brazilianNames.lastNames.length)]
  
  const ageRange = positionAges[position as keyof typeof positionAges]
  const marketRange = positionMarketValues[position as keyof typeof positionMarketValues]
  const ratingRange = positionRatings[position as keyof typeof positionRatings]
  
  const age = Math.floor(Math.random() * (ageRange.max - ageRange.min + 1)) + ageRange.min
  const rating = Math.floor(Math.random() * (ratingRange.max - ratingRange.min + 1)) + ratingRange.min
  const marketValue = Math.floor(Math.random() * (marketRange.max - marketRange.min + 1)) + marketRange.min
  
  return {
    id: Math.floor(Math.random() * 100000),
    name: `${firstName} ${lastName}`,
    position,
    age,
    nationality: 'Brasil',
    teamId,
    marketValue,
    rating,
    height: Math.floor(Math.random() * 25) + 165, // 165-190cm
    preferredFoot: Math.random() > 0.8 ? 'left' : 'right'
  }
}