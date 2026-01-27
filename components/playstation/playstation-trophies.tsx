'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Game, ProfileSummary } from '@/lib/playstation-types'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePlaystationStore } from '../playstation-store-provider'
import { PlatformIcon } from './platform-icon'
import PlayStationTrophyCardList from './play-station-trophy-card-list'
import { TrophyIcon } from './trophy'

interface PlayStationTrophiesProps {
  profile: ProfileSummary
}

export function PlayStationTrophies({ profile }: PlayStationTrophiesProps) {
  const [mounted, setMounted] = useState(false)
  const showPossibleSpoilerTrophies = usePlaystationStore(
    (state) => state.showPossibleSpoilerTrophies,
  )
  const setShowPossibleSpoilerTrophies = usePlaystationStore(
    (state) => state.setShowPossibleSpoilerTrophies,
  )

  useEffect(() => {
    setMounted(true)
  }, [])

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
          {!mounted ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-11 bg-neutral-700 rounded-full animate-pulse scale-75 origin-left" />
              <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse -ml-3" />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
        <PlayStationTrophyCardList games={profile.platinumGames} />
      </CardContent>
    </Card>
  )
}

function TrophiesSummary({ profile }: { profile: ProfileSummary }) {
  const trophiesSummary = [
    {
      type: 'default',
      count: profile.totalTrophies,
    },
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

function GameCard({ game }: { game: Game }) {
  const { title, iconUrl, earnedDate, earnedTrophies, platform } = game
  const showTrophies = ['platinum', 'gold', 'silver', 'bronze'] as const

  return (
    <div className="flex gap-2 border rounded-md p-4 items-center cursor-default">
      <div className="w-20 h-20 relative shrink-0 overflow-hidden rounded">
        {platform !== 'PS5' && (
          <Image
            src={iconUrl}
            alt={title}
            fill
            className="object-cover blur-sm"
          />
        )}
        <Image src={iconUrl} alt={title} fill className="object-contain" />
        <PlatformIcon
          platform={platform}
          className="absolute bottom-0 left-0 right-0 w-full h-[14px] bg-foreground/80 text-background flex items-center justify-center"
        />
      </div>
      <div className="flex flex-col justify-between h-full overflow-hidden">
        <div>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {title}
          </div>
          <div className="flex items-center gap-2">
            {showTrophies.map((trophy) => (
              <TrophyIcon
                key={trophy}
                type={trophy}
                count={earnedTrophies[trophy]}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {dayjs(earnedDate).format('YYYY-MM-DD')}
        </div>
      </div>
    </div>
  )
}
