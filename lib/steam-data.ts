import type { SteamProfileSummary } from './steam-types'

export async function getSteamProfile(): Promise<SteamProfileSummary> {
  const response = await fetch(
    `${process.env.STEAM_API_URL}/api/profile-summary`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch Steam profile: ${response.status}`)
  }

  return response.json()
}
