import { useParams } from 'react-router'
import { AdjacentNav } from '@/app/components/adjacent-nav'
import { BadgeList } from '@/app/components/badge-list'
import GoTop from '@/app/components/go-top'
import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'
import TableOfContents from '@/app/components/toc'
import { Card, CardContent } from '@/components/ui/card'
import { getAdjacentPosts, getPost } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { pageMeta } from '@/lib/meta'
import { getPostBadges } from '@/lib/post-utils'
import { cn } from '@/lib/tailwind-utils'
import NotFound from './not-found'

export const meta = ({ params }: { params: { slug: string } }) => {
  const post = getPost(params.slug)

  return pageMeta(
    post ? `${post.title} | Rory's Blog` : "页面不存在 | Rory's blog",
  )
}

export default function Post() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return <NotFound />
  }

  const { headerImage, title, displayDate, readingTime, toc } = post
  const { previous, next } = getAdjacentPosts(post.slug)
  const badges = getPostBadges(post)

  return (
    <>
      <MainLayout
        left={
          <div className="hidden md:block md:sticky md:top-6">
            <Card className="p-6">
              <TableOfContents toc={toc} />
            </Card>
          </div>
        }
        right={<PostList currentSlug={post.slug} />}
        main={
          <>
            <Card className="overflow-hidden">
              {headerImage && (
                <div className="relative w-full h-56">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={headerImage}
                    alt={title}
                  />
                </div>
              )}
              <CardContent className="p-6">
                <article className="space-y-4" id="content">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  <div className="text-primary/50 space-x-2">
                    <span>{displayDate}</span>
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
                    <MDXContent code={post.code} />
                  </div>
                  {/* Tag */}
                  <BadgeList badges={badges} />
                </article>
              </CardContent>
            </Card>
            <AdjacentNav previous={previous} next={next} />
          </>
        }
      />
      <GoTop toc={toc} />
    </>
  )
}
