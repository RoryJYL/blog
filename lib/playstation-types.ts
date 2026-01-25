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
  npCommunicationId: string
  trophyDetails: {
    trophies: TrophyDetail[]
    updatedAt: string
  }
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

export type TrophyType = 'platinum' | 'gold' | 'silver' | 'bronze'

export interface TrophyDetail {
  trophyId: number
  trophyHidden: boolean
  trophyType: TrophyType
  trophyName: string
  trophyDetail: string
  trophyIconUrl: string
  trophyGroupId: string
  earned: boolean
  earnedDateTime: string
  trophyRare: number
  trophyEarnedRate: string
}
