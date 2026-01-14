export interface TrophyCount {
  bronze: number
  silver: number
  gold: number
  platinum: number
}

export type Platform = 'PS5' | 'PS4' | 'PS3' | string

export interface Game {
  title: string
  iconUrl: string
  earnedDate: string
  earnedTrophies: TrophyCount
  platform: Platform
  progress: number
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
