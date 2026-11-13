export type NavLink = {
  title: string
  href: string
  /** 该导航项对应的路径前缀：列表页和详情页路径不一定同构（/posts 与 /post/<slug>） */
  matchPrefixes: string[]
}

export const navLinks: NavLink[] = [
  {
    title: '首页',
    href: '/',
    matchPrefixes: ['/'],
  },
  {
    title: '絮语',
    href: '/thoughts',
    matchPrefixes: ['/thoughts', '/thought'],
  },
  {
    title: '文章',
    href: '/posts',
    matchPrefixes: ['/posts', '/post'],
  },
  {
    title: '游戏',
    href: '/gamer-profile/playstation',
    matchPrefixes: ['/gamer-profile'],
  },
]

export function isNavLinkActive(link: NavLink, pathname: string) {
  return link.matchPrefixes.some((prefix) =>
    prefix === '/'
      ? pathname === '/'
      : pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
