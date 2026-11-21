import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Post } from '@/lib/content'
import { getPostBadges } from '@/lib/post-utils'
import { BadgeList } from '../badge-list'

type PostCardProps = {
  post: Post
  isFirst?: boolean
}

export function PostCard({ post, isFirst = false }: PostCardProps) {
  const { headerImage, title, url, excerpt, displayDate } = post

  const badges = getPostBadges(post)

  return (
    <Card className="overflow-hidden">
      {headerImage && (
        <div className="w-full h-56">
          <Link to={url} className="relative block h-full">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={headerImage}
              alt={title}
              loading={isFirst ? 'eager' : 'lazy'}
            />
          </Link>
        </div>
      )}
      <CardContent className="p-5 space-y-4">
        <article>
          <h2 className="text-2xl text-primary/95 hover:text-primary transition">
            <Link to={url}>{title}</Link>
          </h2>
        </article>
        <section className="text-primary/75">{excerpt}</section>
        <BadgeList badges={badges} />
        <div className="flex justify-between text-primary/50">
          <div>
            <span>{displayDate}</span>
          </div>
          <div>
            <Button
              className="font-normal text-primary/80 hover:text-primary/95 transition"
              variant="link"
              asChild
            >
              <Link to={url}>继续阅读</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
