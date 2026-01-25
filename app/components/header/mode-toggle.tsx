'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/tailwind-utils'
import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'

const menuItems = [
  {
    title: '跟随系统',
    value: 'system',
    icon: <Icon icon="lucide:laptop" className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    title: '总是浅色',
    value: 'light',
    icon: <Icon icon="lucide:sun" className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    title: '总是深色',
    value: 'dark',
    icon: <Icon icon="lucide:moon" className="h-[1.2rem] w-[1.2rem]" />,
  },
] as const

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Icon
            icon="lucide:sun"
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            icon="lucide:moon"
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1" align="end">
        {menuItems.map((item) => (
          <DropdownMenuItem
            className={cn(
              'flex space-x-2 cursor-pointer',
              theme === item.value && 'bg-gray-200 dark:bg-gray-700',
            )}
            key={item.value}
            onClick={() => setTheme(item.value)}
          >
            {item.icon}
            <div>{item.title}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
