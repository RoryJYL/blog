import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

const navLinks: { title: string; href: string; description?: string }[] = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '絮语',
    href: '/thoughts',
  },
  {
    title: '文章',
    href: '/posts',
  },
  {
    title: '游戏',
    href: '/gamer-profile',
  },
]

export function Header() {
  return (
    <nav className="xl:px-0 py-2 px-4 bg-background">
      <div className="mx-auto flex items-center xl:max-w-7xl md:max-w-5xl">
        <h1>
          <Link href="/">
            <Button variant="ghost">
              <span>Rory's Blog</span>
            </Button>
          </Link>
        </h1>
        <div className="mr-auto flex">
          <Navigation />
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

function Navigation() {
  return (
    <>
      {navLinks.map((link) => (
        <Link href={link.href} key={link.href}>
          <Button variant="ghost">{link.title}</Button>
        </Link>
      ))}
    </>
  )
}
