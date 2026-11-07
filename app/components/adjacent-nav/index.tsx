import Link from 'next/link'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/tailwind-utils'

type AdjacentItem = {
  title: string
  url: string
}

type AdjacentNavProps = {
  previous?: AdjacentItem
  next?: AdjacentItem
}

export function AdjacentNav({ previous, next }: AdjacentNavProps) {
  if (!previous && !next) {
    return null
  }

  return (
    <nav className="mt-4 grid gap-3 sm:grid-cols-2">
      {previous ? (
        <AdjacentLink item={previous} direction="previous" />
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <AdjacentLink item={next} direction="next" />
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}

function AdjacentLink({
  item,
  direction,
}: {
  item: AdjacentItem
  direction: 'previous' | 'next'
}) {
  const isPrevious = direction === 'previous'

  return (
    <Link
      href={item.url}
      className={cn(
        'group rounded-lg border bg-card p-4 shadow-sm transition-colors',
        'hover:border-primary/20 hover:bg-muted/40',
        !isPrevious && 'sm:text-right',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1 text-xs text-muted-foreground',
          !isPrevious && 'sm:justify-end',
        )}
      >
        {isPrevious && <Icon icon="lucide:arrow-left" className="size-3.5" />}
        <span>{isPrevious ? '上一篇' : '下一篇'}</span>
        {!isPrevious && <Icon icon="lucide:arrow-right" className="size-3.5" />}
      </div>
      <div className="mt-2 line-clamp-1 text-sm font-medium text-primary/90 transition-colors group-hover:text-primary">
        {item.title}
      </div>
    </Link>
  )
}
