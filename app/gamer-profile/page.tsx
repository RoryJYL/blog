import { PlayStationTrophies } from '@/components/playstation/playstation-trophies'
import { getPlayStationProfile } from '@/lib/playstation-data'

export default async function GamerProfilePage() {
  const profile = await getPlayStationProfile()

  return (
    <div className="mx-auto px-6 md:px-4 py-6 xl:max-w-7xl md:max-w-5xl md:min-h-[calc(100vh-56px-168px)]">
      <PlayStationTrophies profile={profile} />
    </div>
  )
}
