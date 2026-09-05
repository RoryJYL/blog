import { cn } from '@/lib/tailwind-utils'
import { Icon } from '@iconify/react'

export interface AchievementSummaryIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count: number
}

/**
 * Steam 成就无等级体系，用 Steam logo + 数字表示总成就数
 */
export function AchievementSummaryIcon({
  className,
  count,
  ...props
}: AchievementSummaryIconProps) {
  return (
    <div
      className={cn('flex items-center gap-1 font-500', className)}
      {...props}
    >
      <Icon icon="mdi:steam" className="text-foreground" />
      <span>{count.toLocaleString()}</span>
    </div>
  )
}

export interface PerfectGamesIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count: number
}

/**
 * 全成就游戏数，用 100% 徽章表示
 */
export function PerfectGamesIcon({
  className,
  count,
  ...props
}: PerfectGamesIconProps) {
  return (
    <div
      className={cn('flex items-center gap-1 font-500', className)}
      {...props}
    >
      <Icon icon="mdi:check-decagram" className="text-[#66c0f4]" />
      <span>{count.toLocaleString()}</span>
    </div>
  )
}
