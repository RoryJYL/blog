import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { publishedPosts, publishedThoughts } from '@/lib/content'
import { cn } from '@/lib/tailwind-utils'

function getInfosByPathname(pathname: string) {
  // 处理文章相关路径：/posts, /post/*, /posts/*
  if (
    pathname === '/posts' ||
    pathname.startsWith('/post/') ||
    pathname.startsWith('/posts/')
  ) {
    return { infos: publishedPosts, title: '所有文章', href: '/posts' }
  }

  // 处理思考相关路径：/thoughts, /thoughts/*, /thought/*
  if (
    pathname === '/thoughts' ||
    pathname.startsWith('/thoughts/') ||
    pathname.startsWith('/thought/')
  ) {
    return {
      infos: publishedThoughts,
      title: '所有碎碎念',
      href: '/thoughts',
    }
  }

  return { infos: [], title: '', href: undefined }
}

export function PostList({ currentSlug }: { currentSlug?: string }) {
  // 根据不同路由，拿不同的数据
  const { pathname } = useLocation()
  const { infos, title, href } = getInfosByPathname(pathname)

  return (
    <Card className="hidden md:block">
      <CardContent className="pt-4">
        {!!title &&
          (href ? (
            <Link to={href} className="inline-block text-lg font-bold mb-2">
              {title}
            </Link>
          ) : (
            <div className="text-lg font-bold mb-2">{title}</div>
          ))}
        <div className="flex flex-col">
          {infos.map((info) => (
            <Button
              variant="link"
              className={cn(
                'p-0 h-9 justify-start',
                'hover:no-underline',
                'text-primary/70 hover:text-primary',
                currentSlug === info.slug && 'text-primary',
                !currentSlug && 'text-primary/80 hover:text-primary',
              )}
              key={info.slug}
              asChild
            >
              <Link to={info.url}>{info.title}</Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
