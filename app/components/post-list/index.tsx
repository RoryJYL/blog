'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAllPostsInfo, getAllThoughtsInfo } from '@/lib/contentplayer-utils'
import { cn } from '@/lib/tailwind-utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function getInfosByPathname(pathname: string) {
  // 处理文章相关路径：/posts, /post/*, /posts/*
  if (
    pathname === '/posts' ||
    pathname.startsWith('/post/') ||
    pathname.startsWith('/posts/')
  ) {
    return { infos: getAllPostsInfo(), title: '所有文章' }
  }

  // 处理思考相关路径：/thoughts, /thoughts/*, /thought/*
  if (
    pathname === '/thoughts' ||
    pathname.startsWith('/thoughts/') ||
    pathname.startsWith('/thought/')
  ) {
    return { infos: getAllThoughtsInfo(), title: '所有碎碎念' }
  }

  return { infos: [], title: '' }
}

export function PostList({
  currentId,
}: {
  currentId?: string
}) {
  // 根据不同路由，拿不同的数据
  const pathname = usePathname()
  const { infos, title } = getInfosByPathname(pathname)

  return (
    <Card className="hidden md:block">
      <CardContent className="pt-4">
        {!!title && <div className="text-lg font-bold mb-2">{title}</div>}
        <div className="flex flex-col">
          {infos.map((info) => (
            <Button
              variant="link"
              className={cn(
                'p-0 h-9 justify-start',
                'hover:no-underline',
                'text-primary/70 hover:text-primary',
                currentId === info._id && 'text-primary',
                !currentId && 'text-primary/80 hover:text-primary',
              )}
              key={info._id}
              asChild
            >
              <Link href={info.url}>{info.title}</Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
