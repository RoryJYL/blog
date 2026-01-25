import { Button } from '@/components/ui/button'
import { cn } from '@/lib/tailwind-utils'
import { Icon } from '@iconify/react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "首页 | Rory's blog",
  description: 'Rory的个人博客，记录生活和技术。',
}

export default async function Home() {
  return (
    <div className="px-4 min-h-[calc(100vh-56px-168px)] flex flex-col">
      <div className="flex-1 space-y-2 mx-auto px-4 pt-4 pb-10 xl:max-w-7xl md:max-w-5xl flex flex-col justify-between">
        <div className={cn('prose prose-slate dark:prose-invert max-w-none')}>
          <h1 className="text-3xl font-bold mb-4">Hello, I'm Rory</h1>
          <p>我是一个热爱游戏的软件工程师，欢迎来到我的博客。</p>
          <p>在这里你可以找到一些可能对你有用的东西，以及我的碎碎念。</p>
          <p>
            你可以从这里开始：
            <Link
              href="/thoughts"
              className="transition-opacity underline-offset-2 hover:opacity-75 dark:hover:opacity-85"
            >
              <span>絮语</span>
            </Link>
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Find me at:</p>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="text-base">
              <Link
                href="https://github.com/RoryJYL"
                className="flex no-underline gap-1"
                target="_blank"
              >
                <Icon icon="mdi:github" />
                <span>GitHub</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-base">
              <Link
                href="https://steamcommunity.com/id/RoryJi"
                className="flex no-underline gap-1"
                target="_blank"
              >
                <Icon icon="mdi:steam" />
                <span>Steam</span>
              </Link>
            </Button>
            {/* email */}
            <Button variant="outline" asChild className="text-base">
              <Link
                href="mailto:rory@rorytech.com"
                className="flex no-underline gap-1"
                target="_blank"
              >
                <Icon icon="mdi:email" />
                <span>Email</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
