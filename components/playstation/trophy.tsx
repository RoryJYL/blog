import { cn } from '@/lib/tailwindUtils'
import { Icon } from '@iconify/react'

export interface TrophyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of trophy
   */
  type: 'default' | 'gold' | 'silver' | 'bronze' | 'platinum'
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

export function Trophy({ className, type, count, ...props }: TrophyProps) {
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
