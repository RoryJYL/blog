'use client'

import { Button } from '@/components/ui/button'
import { useActiveSection } from '@/hooks/use-active-section'
import { cn } from '@/lib/tailwind-utils'

type TocItem = {
  depth: number
  value: string
  slug: string
}

type TableOfContentsProps = {
  toc: TocItem[]
  onItemClick?: (slug: string) => void
}

export default function TableOfContents({
  toc,
  onItemClick,
}: TableOfContentsProps) {
  const searchToc = [{ depth: 1, value: '', slug: 'h1' }, ...toc]
  const activeId = useActiveSection(searchToc, {
    topLine: 0.2,
    depths: [2, 3, 4, 5, 6],
  })

  return (
    <nav aria-label="文章目录">
      <div className="text-lg font-bold mb-2">文章目录</div>
      <ul>
        {toc.map((item) => (
          <li key={item.slug}>
            <Button
              variant="link"
              className={cn(
                'p-0',
                'hover:no-underline',
                'text-primary/70 hover:text-primary',
                'text-sm',
                activeId === item.slug && 'text-primary',
              )}
              style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
              size="sm"
              asChild
            >
              <a
                href={`#${item.slug}`}
                onClick={() => onItemClick?.(item.slug)}
              >
                {item.value}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
