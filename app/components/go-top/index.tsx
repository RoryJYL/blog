'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { TocItem } from '@/hooks/use-active-section'
import { cn } from '@/lib/tailwind-utils'
import TableOfContents from '../toc'

type GoTopProps = {
  toc?: TocItem[]
}

export default function GoTop({ toc }: GoTopProps) {
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={cn('fixed bottom-4 right-7 z-100 space-y-2')}>
      {toc && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div
              className={cn(
                'block md:hidden cursor-pointer',
                'flex items-center justify-center w-10 h-10 bg-secondary rounded shadow-sm',
                'hover:text-sky-500 transition-colors',
              )}
            >
              <Icon icon="lucide:align-justify" className="h-6 w-6" />
            </div>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader className="sr-only">
              <SheetTitle>文章目录</SheetTitle>
              <SheetDescription>文章目录</SheetDescription>
            </SheetHeader>
            <TableOfContents
              toc={toc}
              className="border-none"
              onItemClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
      <Link
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        className={cn(
          'flex items-center justify-center w-10 h-10 bg-secondary rounded shadow-sm',
          'hover:text-sky-500 transition-[opacity,color] duration-200',
          showTop ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        href="#"
      >
        <Icon icon="lucide:chevron-up" className="h-6 w-6" />
      </Link>
    </div>
  )
}
