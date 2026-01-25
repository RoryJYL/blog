import { badgeVariants } from '@/components/ui/badge'
import type { PostBadge } from '@/lib/postUtils'
import { cn } from '@/lib/tailwindUtils'

type TagListProps = {
  badges: PostBadge[]
}

export function BadgeList({ badges }: TagListProps) {
  return (
    <div className="space-x-2">
      {badges.map((badge, index) => (
        <span key={`${badge.name}-${badge.url}`}>
          <div
            className={cn(
              badgeVariants({
                variant: badge.isPrimary ? 'secondary' : 'outline-solid',
              }),
              'text-opacity-60 hover:text-opacity-85 transition',
            )}
            // href={badge.url}
          >
            {!badge.isPrimary && '#'}
            {badge.name}
          </div>
        </span>
      ))}
    </div>
  )
}
