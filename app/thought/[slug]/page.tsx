import { mdxComponents } from '@/app/components/markdown-components/mdx-components'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getAllThoughtsInfo, getThought } from '@/lib/contentplayer-utils'
import { cn } from '@/lib/tailwind-utils'
import dayjs from 'dayjs'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'

type ThoughtPageProps = {
  params: { slug: string }
}

export const generateMetadata = async ({ params }: ThoughtPageProps) => {
  const { slug } = params
  const thought = getThought(slug)

  return {
    title: `${thought?.title} | Rory's Blog`,
  }
}

export default function ThoughtPage({ params }: ThoughtPageProps) {
  const { slug } = params
  const thought = getThought(slug)

  if (!thought) {
    notFound()
  }

  const MDXContent = useMDXComponent(thought.body.code)

  return (
    <article>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold mb-2">{thought.title}</h1>
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

export function generateStaticParams() {
  const allThoughtSlugs = getAllThoughtsInfo(['slug'])
  return allThoughtSlugs.map((thought) => ({
    slug: thought.slug,
  }))
}
