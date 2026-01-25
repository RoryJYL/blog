import { BadgeList } from '@/app/components/badge-list'
import GoTop from '@/app/components/go-top'
import { mdxComponents } from '@/app/components/markdown-components/mdx-components'
import { Card, CardContent } from '@/components/ui/card'
import { getAllPostSlugs, getPost } from '@/lib/contentplayer-utils'
import { getPostBadges } from '@/lib/post-utils'
import { cn } from '@/lib/tailwind-utils'
import dayjs from 'dayjs'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'
import { notFound } from 'next/navigation'

type PostPageProps = {
  params: { slug: string }
}

export const generateMetadata = async ({ params }: PostPageProps) => {
  const { slug } = params
  const post = getPost(slug)

  return {
    title: `${post?.title} | Rory's Blog`,
  }
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const { headerImage, date, tags, title, readingTime } = post

  const MDXContent = useMDXComponent(post.body.code)

  const badges = getPostBadges(post)

  return (
    <>
      <Card className="overflow-hidden">
        {headerImage && (
          <div className="relative w-full h-56">
            <Image
              className="object-cover"
              src={headerImage}
              alt={title}
              fill
            />
          </div>
        )}
        <CardContent className="p-6">
          <article className="space-y-4" id="content">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="text-primary/50 space-x-2">
              <span>{dayjs(date).format('YYYY-MM-DD')}</span>
              <span>·</span>
              <span>{readingTime.text}</span>
            </div>
            {/* 文章内容 */}
            <div
              className={cn(
                'prose prose-slate dark:prose-invert max-w-none',
                'prose-a:transition-opacity prose-a:underline-offset-2 hover:prose-a:opacity-75 dark:hover:prose-a:opacity-85',
              )}
            >
              <MDXContent components={mdxComponents} />
            </div>
            {/* Tag */}
            <BadgeList badges={badges} />
          </article>
        </CardContent>
      </Card>
      <GoTop toc={post.toc} />
    </>
  )
}

export function generateStaticParams() {
  const allPostSlugs = getAllPostSlugs()
  return allPostSlugs.map((slug) => ({
    slug,
  }))
}
