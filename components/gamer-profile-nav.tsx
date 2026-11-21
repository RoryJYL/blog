import { Link, useMatch } from 'react-router'
import { cn } from '@/lib/tailwind-utils'

const items = [
  { href: '/gamer-profile/playstation', label: 'PlayStation' },
  { href: '/gamer-profile/steam', label: 'Steam' },
]

export function GamerProfileNav() {
  return (
    <div className="flex gap-2 mb-1.5">
      {items.map((item) => (
        <TabLink key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  )
}

function TabLink({ href, label }: { href: string; label: string }) {
  // 不能拿 pathname 做字符串相等比较：预渲染时 React Router 给 HTML 请求补了尾斜杠
  // （`/gamer-profile/playstation/`），静态 HTML 里没有高亮，而 hydration 不会修正属性差异，
  // 刷新后高亮就一直是灭的。用路由匹配器比较，SSR 和客户端才会得到同一个结果。
  const isActive = useMatch(href) !== null

  return (
    <Link
      to={href}
      className={cn(
        'px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer',
        isActive
          ? 'bg-foreground text-background border-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </Link>
  )
}
