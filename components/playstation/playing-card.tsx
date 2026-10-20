'use client'

import Image from 'next/image'
import { Clock, Gamepad2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { ResolvedGame } from '@/hooks/use-playstation-presence'

export function PlayingCard({ game, playDuration }: ResolvedGame) {
  const meta = [
    { key: 'platform', icon: Gamepad2, text: game.platform },
    {
      key: 'duration',
      icon: Clock,
      text: playDuration ? formatPlayDuration(playDuration) : null,
    },
  ].filter((item) => item.text)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mb-4 overflow-hidden rounded-xl border bg-muted"
    >
      <div className="relative aspect-video w-full bg-neutral-900">
        {game.imageUrl && (
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            unoptimized
            className="object-cover"
          />
        )}
        {/* 桌面把信息压在图上，需要渐变托底；移动端信息在图片下方，不需要 */}
        <div className="absolute inset-0 hidden bg-linear-to-t from-black/90 via-black/25 to-transparent sm:block" />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2 p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:gap-3 sm:p-6 md:p-8">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:text-white/60">
            正在玩
          </p>
          <h2 className="mt-1 line-clamp-2 text-xl font-semibold leading-tight text-foreground sm:text-white md:text-3xl">
            {game.title}
          </h2>
        </div>

        {meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground sm:text-white/70">
            {meta.map((item) => (
              <span key={item.key} className="flex items-center gap-1.5">
                <item.icon className="size-3.5 shrink-0" />
                <span className="font-medium tabular-nums">{item.text}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/** ISO 8601 duration（PT228H56M33S）→ 人话 */
function formatPlayDuration(iso: string): string {
  const match = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/)
  const days = Number(match?.[1] ?? 0)
  const hours = Number(match?.[2] ?? 0)
  const minutes = Number(match?.[3] ?? 0)

  const totalHours = days * 24 + hours
  if (totalHours > 0) return `${totalHours} 小时`
  if (minutes > 0) return `${minutes} 分钟`
  return '不到 1 分钟'
}
