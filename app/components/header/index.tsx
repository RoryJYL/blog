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
          <Button variant="ghost" asChild>
            <Link href="/">Rory's Blog</Link>
          </Button>
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
        <Button variant="ghost" key={link.href} asChild>
          <Link href={link.href}>{link.title}</Link>
        </Button>
      ))}
    </>
  )
}
