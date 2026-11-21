import { useLoaderData } from 'react-router'
import { PlatformUnavailable } from '@/components/platform-unavailable'
import { SteamAchievements } from '@/components/steam/steam-achievements'
import { pageMeta } from '@/lib/meta'
import { getSteamProfile } from '@/lib/steam-data'

export const meta = () => pageMeta("游戏档案: Steam | Rory's Blog")

/**
 * 构建时拉一次数据。拉不到就降级渲染 PlatformUnavailable，
 * 而不是让整次构建失败。
 */
export async function loader() {
  const profile = await getSteamProfile().catch((error: unknown) => {
    console.warn('[steam] profile fetch failed:', error)
    return null
  })

  return { profile, apiUrl: process.env.STEAM_API_URL ?? '' }
}

export default function Steam() {
  const { profile, apiUrl } = useLoaderData<typeof loader>()

  return profile ? (
    <SteamAchievements profile={profile} apiUrl={apiUrl} />
  ) : (
    <PlatformUnavailable platform="Steam" />
  )
}
