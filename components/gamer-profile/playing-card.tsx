'use client'

import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

export interface PlayingCardMeta {
  key: string
  icon: LucideIcon
  /** null 表示这条信息缺失，卡片自己过滤 */
  text: string | null
}

interface PlayingCardProps {
  title: string
  imageUrl: string | null
  meta?: PlayingCardMeta[]
}

export function PlayingCard({ title, imageUrl, meta = [] }: PlayingCardProps) {
  const items = meta.filter((item) => item.text)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mb-4 overflow-hidden rounded-xl border bg-muted"
    >
      <div className="relative aspect-video w-full bg-neutral-900">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
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
            {title}
          </h2>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground sm:text-white/70">
            {items.map((item) => (
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
