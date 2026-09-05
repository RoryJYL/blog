export interface SteamAchievementDetail {
  name: string
  displayName: string
  description: string
  iconUrl: string
  iconGrayUrl: string
  hidden: boolean
  achieved: boolean
  unlockTime: string
  percent: number
}

export interface SteamGame {
  appId: number
  name: string
  iconUrl: string
  playtimeMinutes: number
  lastPlayed: string
  earnedAchievements: number
  totalAchievements: number
  achievementDetails?: {
    achievements: SteamAchievementDetail[]
    updatedAt: string
  }
}

export interface SteamProfileSummary {
  steamId: string
  personaName: string
  avatarUrl: string
  profileUrl: string
  totalAchievements: number
  perfectGames: SteamGame[]
}
