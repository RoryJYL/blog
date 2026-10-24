import type { SteamPresence } from './steam-types'

export interface ResolvedPlayingGame {
  title: string
  imageUrl: string | null
  /** 该游戏累计游玩分钟数，展示时再格式化 */
  playtimeMinutes: number | null
}

/**
 * 只在真的在玩游戏、且状态是在线时返回内容。
 *
 * 忙碌/离开/打盹/想交易这些状态在博客上没有信息量，一律不展示——和 PlayStation
 * 一样，卡片只服务于「此刻正在发生」。
 */
export function resolvePlayingGame(
  presence: SteamPresence | null,
): ResolvedPlayingGame | null {
  if (presence?.onlineStatus !== 'online' || !presence.game) return null

  return {
    title: presence.game.title,
    imageUrl: presence.game.imageUrl,
    playtimeMinutes: presence.game.playtimeMinutes,
  }
}
