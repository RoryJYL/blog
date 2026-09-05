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
    href: '/gamer-profile/playstation',
  },
]

export function Header() {
  return (
    <nav className="xl:px-0 py-2 px-4 bg-background">
      <div className="mx-auto flex max-[420px]:flex-wrap items-center max-[420px]:justify-between justify-start xl:max-w-7xl md:max-w-5xl">
        <h1>
          <Button variant="ghost" asChild>
            <Link href="/">Rory's Blog</Link>
          </Button>
        </h1>
        <div className="max-[420px]:order-last flex w-full order-0 md:mr-auto md:w-auto overflow-x-auto">
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
