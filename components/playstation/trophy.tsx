import type { TrophyType } from '@/lib/playstation-types'
import { cn } from '@/lib/tailwind-utils'
import { Icon } from '@iconify/react'
import Image from 'next/image'

export interface TrophyIconImageProps
  extends React.HTMLAttributes<HTMLImageElement> {
  type: TrophyType
  count?: number
}

export interface TrophyIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of trophy
   */
  type: TrophyType | 'default'
  /**
   * The count of trophies
   */
  count?: number
}

const trophyColors = {
  default: 'text-foreground',
  gold: 'text-[#BB924D]',
  silver: 'text-[#777777]',
  bronze: 'text-[#B86942]',
  platinum: 'text-[#6B7FAE]',
}

const TROPHY_ICONS_BASE_URL = 'https://ab84760.webp.li/play-station'
const TROPHY_ICONS_MAP = {
  platinum: `${TROPHY_ICONS_BASE_URL}/platinum.png`,
  gold: `${TROPHY_ICONS_BASE_URL}/gold.png`,
  silver: `${TROPHY_ICONS_BASE_URL}/silver.png`,
  bronze: `${TROPHY_ICONS_BASE_URL}/bronze.png`,
}

export function TrophyIcon({
  className,
  type,
  count,
  ...props
}: TrophyIconProps) {
  const color = trophyColors[type] || trophyColors.default
  return (
    <div
      className={cn('flex items-center gap-1 font-500', className)}
      {...props}
    >
      <Icon icon="icon-park-solid:trophy" className={color} />
      {count && <span>{count.toLocaleString()}</span>}
    </div>
  )
}

export function TrophyIconImage({
  className,
  type,
  count,
  ...props
}: TrophyIconImageProps) {
  return (
    <Image src={TROPHY_ICONS_MAP[type]} alt={type} fill className={className} />
  )
}
