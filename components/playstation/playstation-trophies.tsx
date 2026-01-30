'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { ProfileSummary } from '@/lib/playstation-types'
import Image from 'next/image'
import { usePlaystationStore } from '../playstation-store-provider'
import PlayStationTrophyCardList from './play-station-trophy-card-list'
import { TrophyIcon } from './trophy'

interface PlayStationTrophiesProps {
  profile: ProfileSummary
}

export function PlayStationTrophies({ profile }: PlayStationTrophiesProps) {
  const showPossibleSpoilerTrophies = usePlaystationStore(
    (state) => state.showPossibleSpoilerTrophies,
  )
  const setShowPossibleSpoilerTrophies = usePlaystationStore(
    (state) => state.setShowPossibleSpoilerTrophies,
  )

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:justify-between font-normal text-xl gap-y-4 space-y-0">
        <div className="shrink-0 flex items-center gap-2">
          <Image
            src={profile.avatarUrl}
            alt={profile.onlineId}
            width={36}
            height={36}
            className="rounded-full"
            unoptimized
          />
          <span>{profile.onlineId}</span>
        </div>
        <TrophiesSummary profile={profile} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Switch
            checked={showPossibleSpoilerTrophies}
            id="show-possible-spoiler-trophies"
            className="data-[state=unchecked]:bg-neutral-700 data-[state=checked]:bg-primary/50 scale-75 origin-left"
            onCheckedChange={(checked) => {
              setShowPossibleSpoilerTrophies(checked)
            }}
          />
          <Label htmlFor="show-possible-spoiler-trophies" className="-ml-1">
            显示可能剧透的奖杯
          </Label>
        </div>
        <PlayStationTrophyCardList games={profile.platinumGames} />
      </CardContent>
    </Card>
  )
}

function TrophiesSummary({ profile }: { profile: ProfileSummary }) {
  const trophiesSummary = [
    {
      type: 'platinum',
      count: profile.platinumTrophies,
    },
    {
      type: 'gold',
      count: profile.goldTrophies,
    },
    {
      type: 'silver',
      count: profile.silverTrophies,
    },
    {
      type: 'bronze',
      count: profile.bronzeTrophies,
    },
  ] as const

  return (
    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
      {trophiesSummary.map((trophy) => (
        <TrophyIcon key={trophy.type} type={trophy.type} count={trophy.count} />
      ))}
    </div>
  )
}
