'use client'

import { useEffect, useRef, useState } from 'react'
import type { PlayingGame, Presence, RecentGame } from '@/lib/playstation-types'

/** 轮询间隔：与 Worker 侧 KV 快照 TTL 对齐 */
const POLL_INTERVAL_MS = 5 * 60 * 1000
export interface ResolvedGame {
  game: PlayingGame | RecentGame
  playDuration: string | null
}

/**
 * 拉取在线状态：挂载时一次，之后每 5 分钟一次，页面不可见时跳过。
 * 失败静默保留上一次数据。
 */
export function usePlaystationPresence(apiUrl: string): Presence | null {
  const [presence, setPresence] = useState<Presence | null>(null)
  const lastFetchedAt = useRef(0)

  useEffect(() => {
    // 没配 PSN_API_URL 时别去请求博客自己的域名（只会 404）
    if (!apiUrl) return

    let cancelled = false

    async function fetchPresence() {
      lastFetchedAt.current = Date.now()
      try {
        const response = await fetch(`${apiUrl}/api/presence`, {
          cache: 'no-store',
        })
        if (!response.ok) return
        const data = (await response.json()) as Presence | null
        if (!cancelled) setPresence(data)
      } catch {
        // 静默失败：保留上一次数据，等下一个周期再试
      }
    }

    function fetchIfStale() {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetchedAt.current < POLL_INTERVAL_MS) return
      void fetchPresence()
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') fetchIfStale()
    }

    void fetchPresence()
    const timer = setInterval(fetchIfStale, POLL_INTERVAL_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [apiUrl])

  return presence
}

/**
 * 只在真的在玩游戏时返回内容，离线（或在线但没进游戏）一律不展示。
 *
 * 规格是给「此刻正在发生」准备的：在线状态是事件，值得占一屏；离线的
 * 「最近在玩」是历史，和下面的奖杯列表同级，不值得用同样的版面再占一次。
 */
export function resolvePlayingGame(
  presence: Presence | null,
): ResolvedGame | null {
  if (presence?.onlineStatus !== 'online' || !presence.game) return null

  // 标题用 presence 的本地化名，图片和时长从 gamelist 补（16:9 原图、准确的游玩时长）
  const matched = presence.recentGame?.titleIds.includes(
    presence.game.titleId ?? '',
  )
  const local = matched ? presence.recentGame : null

  return {
    game: local
      ? { ...presence.game, imageUrl: local.imageUrl ?? presence.game.imageUrl }
      : presence.game,
    playDuration: local?.playDuration ?? null,
  }
}
