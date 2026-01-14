import type { Platform } from '@/lib/playstationTypes'
import { cn } from '@/lib/tailwindUtils'
import PS4Icon from '@/public/icon/ps4.svg'
import PS5Icon from '@/public/icon/ps5.svg'

interface PlatformIconProps extends React.HTMLAttributes<HTMLDivElement> {
  platform: Platform
}

export function PlatformIcon({
  platform,
  className,
  ...props
}: PlatformIconProps) {
  const platformKey = platform.split(',')[0]

  const iconMap: Record<string, React.ReactNode> = {
    PS4: <PS4Icon className="h-full" />,
    PS5: <PS5Icon className="h-full" />,
  }

  const LogoIcon = iconMap[platformKey]

  if (!LogoIcon) {
    return null
  }

  return (
    <div className={cn('p-1 w-10', className)} {...props}>
      {LogoIcon}
    </div>
  )
}
