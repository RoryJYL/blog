import type { ProfileSummary } from './playstation-types'

export async function getPlayStationProfile(): Promise<ProfileSummary> {
  const response = await fetch(
    `${process.env.PSN_API_URL}/api/profile-summary`,
    {
      next: { revalidate: false },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PlayStation profile: ${response.status}`)
  }

  return response.json()
}
