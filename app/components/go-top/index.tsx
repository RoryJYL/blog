'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { TocItem } from '@/hooks/use-active-section'
import { cn } from '@/lib/tailwindUtils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useState } from 'react'
import TableOfContents from '../toc'

type GoTopProps = {
  toc?: TocItem[]
}

export default function GoTop({ toc }: GoTopProps) {
  const [open, setOpen] = useState(false)

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
        className={cn(
          'flex items-center justify-center w-10 h-10 bg-secondary rounded shadow-sm',
          'hover:text-sky-500 transition-colors',
        )}
        href="#"
      >
        <Icon icon="lucide:chevron-up" className="h-6 w-6" />
      </Link>
    </div>
  )
}
