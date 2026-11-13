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
    // 必须低于 Sheet 遮罩的 z-50，否则抽屉打开时按钮浮在遮罩上方却点不动
    <div className={cn('fixed bottom-4 right-7 z-40 space-y-2')}>
      {toc && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="打开文章目录"
              className={cn(
                'md:hidden cursor-pointer p-0',
                'flex items-center justify-center w-10 h-10 bg-secondary rounded shadow-sm',
                'hover:text-sky-500 transition-colors',
              )}
            >
              <Icon
                icon="lucide:align-justify"
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[70vh]"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>文章目录</SheetTitle>
              <SheetDescription>文章目录</SheetDescription>
            </SheetHeader>
            {/* p-2 给 focus ring 留空间，overflow 会裁剪外扩的 ring */}
            <div className="max-h-[calc(70vh-3rem)] overflow-y-auto p-2">
              <TableOfContents toc={toc} onItemClick={() => setOpen(false)} />
            </div>
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
