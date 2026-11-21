import { Link } from 'react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Thought } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { cn } from '@/lib/tailwind-utils'

type ThoughtCardProps = {
  thought: Thought
  /** 传入链接时为列表卡片，不传时为详情页卡片 */
  href?: string
}

export function ThoughtCard({ thought, href }: ThoughtCardProps) {
  return (
    <article>
      <Card>
        <CardHeader>
          {href ? (
            <Link to={href}>
              <h2 className="text-xl font-bold">{thought.title}</h2>
            </Link>
          ) : (
            <h1 className="text-xl font-bold">{thought.title}</h1>
          )}
          <div className="text-sm text-muted-foreground mb-2">
            <span>{thought.displayDate}</span>
            <span className="mx-1">·</span>
            <span>{thought.readingTime.text}</span>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            'prose prose-slate dark:prose-invert max-w-none',
            'prose-a:transition-opacity prose-a:underline-offset-2 hover:prose-a:opacity-75 dark:hover:prose-a:opacity-85',
          )}
        >
          <MDXContent code={thought.code} />
        </CardContent>
      </Card>
    </article>
  )
}
