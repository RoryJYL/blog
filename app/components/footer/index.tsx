import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/tailwindUtils'
import Link from 'next/link'

export function Footer() {
  return (
    <div className="px-4 bg-background">
      <footer className="px-4 mx-auto pt-12 pb-24 xl:max-w-7xl md:max-w-5xl">
        <div
          className={cn(
            'text-primary/80 text-center',
            'md:flex md:justify-between',
          )}
        >
          <div>
            Copyright © 2021 - {new Date().getFullYear()}{' '}
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-base ml-1 h-auto',
              )}
              href="/"
            >
              Rory's Blog
            </Link>
          </div>
          <div>
            Powered by{' '}
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-base h-auto',
              )}
              href="https://nextjs.org/"
            >
              Next.js
            </Link>
            <span className={cn('mx-2', 'after:content-["·"]')} />
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-base h-auto',
              )}
              href="https://contentlayer.dev/"
            >
              Contentlayer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
