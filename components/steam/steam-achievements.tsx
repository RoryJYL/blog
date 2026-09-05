'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { SteamProfileSummary } from '@/lib/steam-types'
import Image from 'next/image'
import { useSteamStore } from '../steam-store-provider'
import { AchievementSummaryIcon, PerfectGamesIcon } from './achievement'
import SteamAchievementCardList from './steam-achievement-card-list'
import Link from 'next/link'

interface SteamAchievementsProps {
  profile: SteamProfileSummary
}

export function SteamAchievements({ profile }: SteamAchievementsProps) {
  const showPossibleSpoilerAchievements = useSteamStore(
    (state) => state.showPossibleSpoilerAchievements,
  )
  const setShowPossibleSpoilerAchievements = useSteamStore(
    (state) => state.setShowPossibleSpoilerAchievements,
  )

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between font-normal text-xl gap-y-4 space-y-0">
        <div className="shrink-0 flex items-center gap-2">
          <Image
            src={profile.avatarUrl}
            alt={profile.personaName}
            width={36}
            height={36}
            className="rounded-full"
            unoptimized
          />
          <Link
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline"
          >
            {profile.personaName}
          </Link>
        </div>
        <AchievementsSummary profile={profile} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Switch
            checked={showPossibleSpoilerAchievements}
            id="show-possible-spoiler-achievements"
            className="data-[state=unchecked]:bg-neutral-700 data-[state=checked]:bg-primary/50 scale-75 origin-left"
            onCheckedChange={(checked) => {
              setShowPossibleSpoilerAchievements(checked)
            }}
          />
          <Label htmlFor="show-possible-spoiler-achievements" className="-ml-1">
            显示可能剧透的成就
          </Label>
        </div>
        <SteamAchievementCardList games={profile.perfectGames} />
      </CardContent>
    </Card>
  )
}

function AchievementsSummary({ profile }: { profile: SteamProfileSummary }) {
  return (
    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
      <AchievementSummaryIcon count={profile.totalAchievements} />
      <PerfectGamesIcon count={profile.perfectGames.length} />
    </div>
  )
}
