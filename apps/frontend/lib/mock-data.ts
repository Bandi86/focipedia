// Mock football data types and structures

export interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  colors: {
    primary: string
    secondary: string
  }
  league: string
  country: string
}

export interface League {
  id: string
  name: string
  country: string
  logo: string
  season: string
  teams: Team[]
}

export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  score: {
    home: number
    away: number
  } | null
  date: Date
  status: "scheduled" | "live" | "finished"
  league: League
  venue?: string
}

export interface Player {
  id: string
  name: string
  position: string
  team: Team
  nationality: string
  age: number
  photo: string
  stats: {
    goals: number
    assists: number
    matches: number
  }
}

export interface UserStats {
  favoriteTeams: number
  matchesWatched: number
  predictionsCorrect: number
  totalPredictions: number
}

// Mock teams data
export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Manchester United",
    shortName: "MUN",
    logo: "/teams/manchester-united.png",
    colors: { primary: "#DA020E", secondary: "#FBE122" },
    league: "Premier League",
    country: "England",
  },
  {
    id: "2",
    name: "Liverpool",
    shortName: "LIV",
    logo: "/teams/liverpool.png",
    colors: { primary: "#C8102E", secondary: "#F6EB61" },
    league: "Premier League",
    country: "England",
  },
  {
    id: "3",
    name: "Manchester City",
    shortName: "MCI",
    logo: "/teams/manchester-city.png",
    colors: { primary: "#6CABDD", secondary: "#1C2C5B" },
    league: "Premier League",
    country: "England",
  },
  {
    id: "4",
    name: "Arsenal",
    shortName: "ARS",
    logo: "/teams/arsenal.png",
    colors: { primary: "#EF0107", secondary: "#023474" },
    league: "Premier League",
    country: "England",
  },
  {
    id: "5",
    name: "Chelsea",
    shortName: "CHE",
    logo: "/teams/chelsea.png",
    colors: { primary: "#034694", secondary: "#ED1C24" },
    league: "Premier League",
    country: "England",
  },
  {
    id: "6",
    name: "Real Madrid",
    shortName: "RMA",
    logo: "/teams/real-madrid.png",
    colors: { primary: "#FEBE10", secondary: "#00529F" },
    league: "La Liga",
    country: "Spain",
  },
  {
    id: "7",
    name: "FC Barcelona",
    shortName: "BAR",
    logo: "/teams/barcelona.png",
    colors: { primary: "#A50044", secondary: "#004D98" },
    league: "La Liga",
    country: "Spain",
  },
  {
    id: "8",
    name: "Bayern Munich",
    shortName: "BAY",
    logo: "/teams/bayern-munich.png",
    colors: { primary: "#DC052D", secondary: "#0066B2" },
    league: "Bundesliga",
    country: "Germany",
  },
]

// Mock leagues data
export const mockLeagues: League[] = [
  {
    id: "1",
    name: "Premier League",
    country: "England",
    logo: "/leagues/premier-league.png",
    season: "2024/25",
    teams: mockTeams.filter((team) => team.league === "Premier League"),
  },
  {
    id: "2",
    name: "La Liga",
    country: "Spain",
    logo: "/leagues/la-liga.png",
    season: "2024/25",
    teams: mockTeams.filter((team) => team.league === "La Liga"),
  },
  {
    id: "3",
    name: "Bundesliga",
    country: "Germany",
    logo: "/leagues/bundesliga.png",
    season: "2024/25",
    teams: mockTeams.filter((team) => team.league === "Bundesliga"),
  },
]

// Mock matches data
export const mockMatches: Match[] = [
  {
    id: "1",
    homeTeam: mockTeams[0], // Manchester United
    awayTeam: mockTeams[1], // Liverpool
    score: { home: 2, away: 1 },
    date: new Date("2024-08-10T15:00:00Z"),
    status: "finished",
    league: mockLeagues[0],
    venue: "Old Trafford",
  },
  {
    id: "2",
    homeTeam: mockTeams[2], // Manchester City
    awayTeam: mockTeams[3], // Arsenal
    score: { home: 1, away: 1 },
    date: new Date("2024-08-11T17:30:00Z"),
    status: "finished",
    league: mockLeagues[0],
    venue: "Etihad Stadium",
  },
  {
    id: "3",
    homeTeam: mockTeams[4], // Chelsea
    awayTeam: mockTeams[0], // Manchester United
    score: null,
    date: new Date("2024-08-15T20:00:00Z"),
    status: "scheduled",
    league: mockLeagues[0],
    venue: "Stamford Bridge",
  },
  {
    id: "4",
    homeTeam: mockTeams[5], // Real Madrid
    awayTeam: mockTeams[6], // Barcelona
    score: { home: 3, away: 2 },
    date: new Date("2024-08-12T21:00:00Z"),
    status: "finished",
    league: mockLeagues[1],
    venue: "Santiago Bernabéu",
  },
  {
    id: "5",
    homeTeam: mockTeams[7], // Bayern Munich
    awayTeam: mockTeams[5], // Real Madrid (Champions League)
    score: null,
    date: new Date("2024-08-20T20:00:00Z"),
    status: "scheduled",
    league: mockLeagues[2],
    venue: "Allianz Arena",
  },
]

// Mock players data
export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Marcus Rashford",
    position: "Forward",
    team: mockTeams[0],
    nationality: "England",
    age: 26,
    photo: "/players/rashford.png",
    stats: { goals: 12, assists: 5, matches: 28 },
  },
  {
    id: "2",
    name: "Mohamed Salah",
    position: "Forward",
    team: mockTeams[1],
    nationality: "Egypt",
    age: 31,
    photo: "/players/salah.png",
    stats: { goals: 18, assists: 8, matches: 30 },
  },
  {
    id: "3",
    name: "Erling Haaland",
    position: "Forward",
    team: mockTeams[2],
    nationality: "Norway",
    age: 23,
    photo: "/players/haaland.png",
    stats: { goals: 22, assists: 3, matches: 25 },
  },
  {
    id: "4",
    name: "Bukayo Saka",
    position: "Winger",
    team: mockTeams[3],
    nationality: "England",
    age: 22,
    photo: "/players/saka.png",
    stats: { goals: 8, assists: 12, matches: 32 },
  },
]

// Mock user statistics
export const mockUserStats: UserStats = {
  favoriteTeams: 3,
  matchesWatched: 47,
  predictionsCorrect: 28,
  totalPredictions: 45,
}

// Mock statistics for landing page
export const mockLandingStats = [
  { value: "50K+", label: "Active Users", icon: "👥" },
  { value: "1.2M+", label: "Matches Tracked", icon: "⚽" },
  { value: "500+", label: "Teams Covered", icon: "🏆" },
  { value: "25+", label: "Leagues", icon: "🌍" },
]

// Mock features for landing page
export const mockFeatures = [
  {
    title: "Live Match Tracking",
    description:
      "Follow your favorite teams and get real-time updates on matches, scores, and statistics.",
    icon: "⚽",
  },
  {
    title: "Team Analytics",
    description:
      "Deep dive into team performance with comprehensive statistics and historical data.",
    icon: "📊",
  },
  {
    title: "Player Profiles",
    description:
      "Explore detailed player information, career stats, and performance metrics.",
    icon: "👤",
  },
  {
    title: "League Coverage",
    description:
      "Stay updated with major leagues from around the world including Premier League, La Liga, and more.",
    icon: "🏆",
  },
  {
    title: "Predictions & Tips",
    description:
      "Make predictions on upcoming matches and compete with other football fans.",
    icon: "🎯",
  },
  {
    title: "Social Features",
    description:
      "Connect with fellow football enthusiasts and share your passion for the beautiful game.",
    icon: "💬",
  },
]

// Utility functions for mock data
export const getTeamById = (id: string): Team | undefined => {
  return mockTeams.find((team) => team.id === id)
}

export const getMatchesByTeam = (teamId: string): Match[] => {
  return mockMatches.filter(
    (match) => match.homeTeam.id === teamId || match.awayTeam.id === teamId
  )
}

export const getRecentMatches = (limit: number = 5): Match[] => {
  return mockMatches
    .filter((match) => match.status === "finished")
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
}

export const getUpcomingMatches = (limit: number = 5): Match[] => {
  return mockMatches
    .filter((match) => match.status === "scheduled")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit)
}

export const getPlayersByTeam = (teamId: string): Player[] => {
  return mockPlayers.filter((player) => player.team.id === teamId)
}

export const getTopScorers = (limit: number = 10): Player[] => {
  return mockPlayers
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, limit)
}
