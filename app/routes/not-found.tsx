import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { publishedPosts } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import { cn } from '@/lib/tailwind-utils'

export const meta = () => [
  ...pageMeta("页面不存在 | Rory's blog"),
  // 别让 404 页自己被索引
  { name: 'robots', content: 'noindex' },
]

export default function NotFound() {
  const recentPosts = publishedPosts.slice(0, 3)

  return (
    <main className="mx-auto px-4 py-24 xl:max-w-7xl md:max-w-5xl">
      <div className="mx-auto max-w-md text-center space-y-6">
        <p className="text-7xl font-bold text-primary/20">404</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">这个页面不存在或者已经搬走了</h1>
          <p className="text-muted-foreground">
            可能是链接打错了，也可能是我改过地址。
          </p>
        </div>
        <Link to="/" className={cn(buttonVariants(), 'font-normal')}>
          返回首页
        </Link>
      </div>

      {recentPosts.length > 0 && (
        <section className="mx-auto mt-16 max-w-md space-y-2">
          <h2 className="text-sm text-muted-foreground">最近的文章</h2>
          <ul className="divide-y rounded-lg border">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.url}
                  className="block px-4 py-3 text-primary/80 transition-colors hover:bg-muted/40 hover:text-primary"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
