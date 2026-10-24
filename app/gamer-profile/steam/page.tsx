import { PlatformUnavailable } from '@/components/platform-unavailable'
import { SteamAchievements } from '@/components/steam/steam-achievements'
import { getSteamProfile } from '@/lib/steam-data'

// 静态导出下强制构建时渲染（fetch 使用 no-store 会默认使路由变动态，导致页面从静态导出中消失）
export const dynamic = 'force-static'

export const metadata = {
  title: "游戏档案: Steam | Rory's Blog",
}

export default async function GamerProfileSteamPage() {
  const result = await getSteamProfile().then(
    (profile) => ({ ok: true as const, profile }),
    () => ({ ok: false as const }),
  )

  return result.ok ? (
    <SteamAchievements
      profile={result.profile}
      apiUrl={process.env.STEAM_API_URL ?? ''}
    />
  ) : (
    <PlatformUnavailable platform="Steam" />
  )
}
