import { GamerProfileNav } from '@/components/gamer-profile-nav'
import { PlatformUnavailable } from '@/components/platform-unavailable'
import { PlayStationTrophies } from '@/components/playstation/playstation-trophies'
import { getPlayStationProfile } from '@/lib/playstation-data'

// 静态导出下强制构建时渲染（fetch 使用 no-store 会默认使路由变动态，导致页面从静态导出中消失）
export const dynamic = 'force-static'

export const metadata = {
  title: "游戏档案: PlayStation | Rory's Blog",
}

export default async function GamerProfilePage() {
  const result = await getPlayStationProfile().then(
    (profile) => ({ ok: true as const, profile }),
    () => ({ ok: false as const }),
  )

  return (
    <div className="mx-auto px-6 md:px-4 py-6 xl:max-w-7xl md:max-w-5xl md:min-h-[calc(100vh-56px-168px)]">
      <GamerProfileNav />
      {result.ok ? (
        <PlayStationTrophies profile={result.profile} />
      ) : (
        <PlatformUnavailable platform="PlayStation" />
      )}
    </div>
  )
}
