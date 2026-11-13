import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SITE_TITLE } from '@/lib/site-config'
import { MobileNav } from './mobile-nav'
import { ModeToggle } from './mode-toggle'
import { navLinks } from './nav-links'

export function Header() {
  return (
    <nav className="relative py-2 px-4 xl:px-0 bg-background">
      <div className="mx-auto flex items-center xl:max-w-7xl md:max-w-5xl">
        <h1 className="font-medium px-2">
          <Link href="/">{SITE_TITLE}</Link>
        </h1>
        <div className="hidden md:flex ml-2">
          <Navigation />
        </div>
        <div className="ml-auto flex items-center">
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </nav>
  )
}

function Navigation() {
  return (
    <>
      {navLinks.map((link) => (
        <Button
          className="px-2.5 py-1.5"
          variant="ghost"
          key={link.href}
          asChild
        >
          <Link href={link.href}>{link.title}</Link>
        </Button>
      ))}
    </>
  )
}
