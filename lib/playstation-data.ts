import type { ProfileSummary } from './playstation-types'

export async function getPlayStationProfile(): Promise<ProfileSummary> {
  const response = await fetch(
    `${process.env.PSN_API_URL}/api/profile-summary`,
    {
      // 构建时永远取最新数据，避免 Next fetch 缓存的陈旧数据（revalidate:false 会永久缓存）
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PlayStation profile: ${response.status}`)
  }

  return response.json()
}
