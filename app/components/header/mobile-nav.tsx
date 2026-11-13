'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { cn } from '@/lib/tailwind-utils'
import { isNavLinkActive, navLinks } from './nav-links'

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef, () => setOpen(false))

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // 打开时锁住滚动，否则模糊层后面的页面会跟着滚
  useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const bodyOverflow = body.style.overflow
    const htmlOverflow = documentElement.style.overflow
    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    return () => {
      body.style.overflow = bodyOverflow
      documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  return (
    <>
      <div ref={containerRef} className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">
            {open ? '关闭导航菜单' : '打开导航菜单'}
          </span>
        </Button>
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full z-120 border bg-background py-3 px-4 shadow-lg"
            >
              <nav aria-label="站点导航" className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-lg p-3 text-muted-foreground transition-colors text-[15px]',
                      'hover:bg-accent hover:text-accent-foreground',
                      isNavLinkActive(link, pathname) &&
                        'bg-accent text-accent-foreground font-medium',
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            // header 高度 56px（py-2 + h-10），模糊层从 header 下方铺满视口
            className="fixed inset-x-0 top-14 bottom-0 z-[110] bg-[rgba(10,10,12,0.6)] backdrop-blur-[4px] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
