'use client'

import { useEffect, useRef, useState } from 'react'

/** 轮询间隔：与 Worker 侧 KV 快照 TTL 对齐 */
const POLL_INTERVAL_MS = 5 * 60 * 1000

/**
 * 拉取平台在线状态：挂载时一次，之后每 5 分钟一次，页面不可见时跳过。
 * 失败静默保留上一次数据。
 */
export function usePresence<T>(apiUrl: string): T | null {
  const [presence, setPresence] = useState<T | null>(null)
  const lastFetchedAt = useRef(0)

  useEffect(() => {
    // 没配 API_URL 时别去请求博客自己的域名（只会 404）
    if (!apiUrl) return

    let cancelled = false

    async function fetchPresence() {
      lastFetchedAt.current = Date.now()
      try {
        const response = await fetch(`${apiUrl}/api/presence`, {
          cache: 'no-store',
        })
        if (!response.ok) return
        const data = (await response.json()) as T | null
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
