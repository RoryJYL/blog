import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getPostBadges } from '@/lib/postUtils'
import type { Post } from 'contentlayer/generated'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeList } from '../badge-list'

type PostCardProps = {
  post: Post
  isFirst?: boolean
}

export function PostCard({ post, isFirst = false }: PostCardProps) {
  const { headerImage, title, url, excerpt, tags, date, category } = post

  const badges = getPostBadges(post)

  return (
    <Card className="overflow-hidden">
      {headerImage && (
        <div className="w-full h-56">
          <Link href={url} className="relative block h-full">
            <Image
              className="object-cover"
              src={headerImage}
              alt={title}
              fill
              priority={isFirst}
            />
          </Link>
        </div>
      )}
      <CardContent className="p-5 space-y-4">
        <article>
          <h2 className="text-2xl text-primary/95 hover:text-primary transition">
            <Link href={url}>{title}</Link>
          </h2>
        </article>
        <section className="text-primary/75">{excerpt}</section>
        <BadgeList badges={badges} />
        <div className="flex justify-between text-primary/50">
          <div>
            <span>{dayjs(date).format('YYYY-MM-DD')}</span>
          </div>
          <div>
            <Button
              className="font-normal text-primary/80 hover:text-primary/95 transition"
              variant="link"
              asChild
            >
              <Link href={url}>继续阅读</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
