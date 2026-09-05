'use client'

import { cn } from '@/lib/tailwind-utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/gamer-profile/playstation', label: 'PlayStation' },
  { href: '/gamer-profile/steam', label: 'Steam' },
]

export function GamerProfileNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-2 mb-4">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer',
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
