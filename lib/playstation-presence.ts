import type { Presence } from './playstation-types'

export interface ResolvedPlayingGame {
  title: string
  imageUrl: string | null
  platform: string | null
  /** ISO 8601 duration，展示时再格式化 */
  playDuration: string | null
}

/**
 * 只在真的在玩游戏时返回内容，离线（或在线但没进游戏）一律不展示。
 *
 * 规格是给「此刻正在发生」准备的：在线状态是事件，值得占一屏；离线的
 * 「最近在玩」是历史，和下面的奖杯列表同级，不值得用同样的版面再占一次。
 */
export function resolvePlayingGame(
  presence: Presence | null,
): ResolvedPlayingGame | null {
  if (presence?.onlineStatus !== 'online' || !presence.game) return null

  // 标题用 presence 的本地化名，图片和时长从 gamelist 补（16:9 原图、准确的游玩时长）
  const matched = presence.recentGame?.titleIds.includes(
    presence.game.titleId ?? '',
  )
  const local = matched ? presence.recentGame : null

  return {
    title: presence.game.title,
    imageUrl: local?.imageUrl ?? presence.game.imageUrl,
    platform: presence.game.platform,
    playDuration: local?.playDuration ?? null,
  }
}
