import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Game, ProfileSummary } from '@/lib/playstationTypes'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { Trophy } from './trophy'

interface PlayStationTrophiesProps {
  profile: ProfileSummary
}

export function PlayStationTrophies({ profile }: PlayStationTrophiesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:justify-between font-normal text-xl gap-y-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.platinumGames.map((game) => (
            <GameCard key={game.title} game={game} />
          ))}
        </div>
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
    <div className="flex items-center gap-4 flex-wrap">
      {trophiesSummary.map((trophy) => (
        <Trophy key={trophy.type} type={trophy.type} count={trophy.count} />
      ))}
    </div>
  )
}

function GameCard({ game }: { game: Game }) {
  const showTrophies = ['platinum', 'gold', 'silver', 'bronze'] as const
  const earnedDate = new Date(game.earnedDate)

  return (
    <div className="flex gap-2 border rounded-md p-4 items-center cursor-default">
      <div className="w-20 h-20 relative shrink-0">
        <Image
          src={game.iconUrl}
          alt={game.title}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-between h-full overflow-hidden">
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                {game.title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{game.title}</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            {showTrophies.map((trophy) => (
              <Trophy
                key={trophy}
                type={trophy}
                count={game.earnedTrophies[trophy]}
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
