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

export interface SteamPlayingGame {
  /** 非 Steam 快捷方式没有 appId */
  appId: number | null
  title: string
  imageUrl: string | null
  playtimeMinutes: number | null
}

export interface SteamPresence {
  /** 只有 personastate === 1 才是 online，忙碌/离开/打盹都折算成 offline */
  onlineStatus: 'online' | 'offline'
  game: SteamPlayingGame | null
  lastLogoff: string | null
  fetchedAt: string
}
