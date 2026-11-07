import Link from 'next/link'
import type { Thought } from 'contentlayer/generated'
import dayjs from 'dayjs'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/tailwind-utils'
import { mdxComponents } from '../markdown-components/mdx-components'

type ThoughtCardProps = {
  thought: Thought
  /** 传入链接时为列表卡片，不传时为详情页卡片 */
  href?: string
}

export function ThoughtCard({ thought, href }: ThoughtCardProps) {
  const MDXContent = useMDXComponent(thought.body.code)

  return (
    <article>
      <Card>
        <CardHeader>
          {href ? (
            <Link href={href}>
              <h2 className="text-xl font-bold">{thought.title}</h2>
            </Link>
          ) : (
            <h1 className="text-xl font-bold">{thought.title}</h1>
          )}
          <div className="text-sm text-muted-foreground mb-2">
            <span>{dayjs(thought.date).format('YYYY-MM-DD')}</span>
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
          <MDXContent components={mdxComponents} />
        </CardContent>
      </Card>
    </article>
  )
}
