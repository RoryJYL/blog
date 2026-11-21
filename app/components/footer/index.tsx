import { Rss } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/tailwind-utils'

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
              to="/"
            >
              Rory's Blog
            </Link>
            <span className={cn('mx-2', 'after:content-["·"]')} />
            <a
              className="font-medium text-primary underline-offset-4 hover:underline"
              href="/atom.xml"
              title="订阅 Atom"
            >
              <Rss className="mr-1 inline size-4 align-[-0.125em]" />
              RSS
            </a>
          </div>
          <div>
            Powered by{' '}
            <a
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-base h-auto',
              )}
              href="https://reactrouter.com/"
            >
              React Router
            </a>
            <span className={cn('mx-2', 'after:content-["·"]')} />
            <a
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 text-base h-auto',
              )}
              href="https://velite.js.org/"
            >
              Velite
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
