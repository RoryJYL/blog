import { useLoaderData } from 'react-router'
import { PlatformUnavailable } from '@/components/platform-unavailable'
import { PlayStationTrophies } from '@/components/playstation/playstation-trophies'
import { pageMeta } from '@/lib/meta'
import { getPlayStationProfile } from '@/lib/playstation-data'

export const meta = () => pageMeta("游戏档案: PlayStation | Rory's Blog")

/**
 * 构建时拉一次数据。拉不到就降级渲染 PlatformUnavailable，
 * 而不是让整次构建失败。
 */
export async function loader() {
  const profile = await getPlayStationProfile().catch((error: unknown) => {
    console.warn('[playstation] profile fetch failed:', error)
    return null
  })

  return { profile, apiUrl: process.env.PSN_API_URL ?? '' }
}

export default function PlayStation() {
  const { profile, apiUrl } = useLoaderData<typeof loader>()

  return profile ? (
    <PlayStationTrophies profile={profile} apiUrl={apiUrl} />
  ) : (
    <PlatformUnavailable platform="PlayStation" />
  )
}
