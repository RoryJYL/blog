export interface TrophyCount {
  bronze: number
  silver: number
  gold: number
  platinum: number
}

export interface Game {
  title: string
  iconUrl: string
  earnedDate: string
  earnedTrophies: TrophyCount
}

export interface ProfileSummary {
  onlineId: string
  avatarUrl: string
  totalTrophies: number
  bronzeTrophies: number
  silverTrophies: number
  goldTrophies: number
  platinumTrophies: number
  platinumGames: Game[]
}

export interface Trophy {
  title: string
  iconUrl: string
  earnedDate: string
  earnedTrophies: TrophyCount
}
