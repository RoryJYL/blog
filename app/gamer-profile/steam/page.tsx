import { GamerProfileNav } from '@/components/gamer-profile-nav'
import { PlatformUnavailable } from '@/components/platform-unavailable'
import { SteamAchievements } from '@/components/steam/steam-achievements'
import { getSteamProfile } from '@/lib/steam-data'

// 静态导出下强制构建时渲染（fetch 使用 no-store 会默认使路由变动态，导致页面从静态导出中消失）
export const dynamic = 'force-static'

export default async function GamerProfileSteamPage() {
  const result = await getSteamProfile().then(
    (profile) => ({ ok: true as const, profile }),
    () => ({ ok: false as const }),
  )

  return (
    <div className="mx-auto px-6 md:px-4 py-6 xl:max-w-7xl md:max-w-5xl md:min-h-[calc(100vh-56px-168px)]">
      <GamerProfileNav />
      {result.ok ? (
        <SteamAchievements profile={result.profile} />
      ) : (
        <PlatformUnavailable platform="Steam" />
      )}
    </div>
  )
}
