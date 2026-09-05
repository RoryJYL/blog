'use client'

import { useOutsideClick } from '@/hooks/use-outside-click'
import type { SteamAchievementDetail, SteamGame } from '@/lib/steam-types'
import { Icon } from '@iconify/react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { useSteamStore } from '../steam-store-provider'

interface SteamAchievementCardListProps {
  games: SteamGame[]
}

export default function SteamAchievementCardList({
  games,
}: SteamAchievementCardListProps) {
  const [active, setActive] = useState<(typeof games)[number] | boolean | null>(
    null,
  )
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className="fixed inset-0 grid place-items-center z-100">
            <motion.div
              layoutId={`steam-card-${active.appId}-${id}`}
              ref={ref}
              className="relative w-[95%] max-w-125 h-[85%] md:h-[90%] flex flex-col rounded-xl overflow-hidden"
            >
              <motion.button
                key={`steam-button-${active.appId}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 items-center justify-center h-6 w-6 z-100 cursor-pointer"
                onClick={() => setActive(null)}
              >
                <Icon icon="mdi:close-circle" className="h-full w-full" />
              </motion.button>
              <ListCard active={active} id={id} />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <motion.div
            layoutId={`steam-card-${game.appId}-${id}`}
            key={`steam-card-${game.appId}-${id}`}
            onClick={() => setActive(game)}
            className="flex max-[450px]:flex-col max-[450px]:items-start gap-2 border rounded-md p-4 items-center cursor-pointer"
          >
            <motion.div
              layoutId={`steam-image-${game.appId}-${id}`}
              className="max-[450px]:w-full aspect-21/10 w-42.75 relative shrink-0 overflow-hidden rounded"
            >
              <Image
                src={game.iconUrl}
                alt={game.name}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
            <div className="flex flex-col justify-between h-full overflow-hidden">
              <div>
                <motion.div
                  layoutId={`steam-title-${game.appId}-${id}`}
                  className="font-medium"
                >
                  {game.name}
                </motion.div>
                <motion.div
                  layoutId={`steam-progress-${game.appId}-${id}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-[#66c0f4]">
                    {game.earnedAchievements}/{game.totalAchievements}
                  </span>
                  <span>成就</span>
                </motion.div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatPlaytime(game.playtimeMinutes)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function ListCard({ active, id }: { active: SteamGame; id: string }) {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: scrollContainer })
  const stop = useTransform(scrollY, [0, 234], [28, 0])
  const bg = useMotionTemplate`
    linear-gradient(transparent, var(--color-secondary) ${stop}%)
  `
  const paddingTop = useTransform(scrollY, [0, 234], [0, 10])

  return (
    <>
      <motion.div
        layoutId={`steam-image-${active.appId}-${id}`}
        className="absolute top-0 left-0 right-0"
      >
        <Image
          width={460}
          height={234}
          src={active.iconUrl}
          alt={active.name}
          className="w-full h-58.5 rounded-tr-lg rounded-tl-lg object-cover"
          unoptimized
        />
      </motion.div>

      <motion.div
        ref={scrollContainer}
        className="px-4 pb-4 relative overflow-auto"
        style={{ background: bg }}
      >
        <motion.div
          className="sticky top-0 mt-58.5 bg-secondary pb-4 flex flex-col gap-y-1 z-10"
          style={{ paddingTop: paddingTop }}
        >
          <motion.div
            layoutId={`steam-title-${active.appId}-${id}`}
            className="font-bold text-lg"
          >
            {active.name}
          </motion.div>
          <motion.div
            layoutId={`steam-progress-${active.appId}-${id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="text-[#66c0f4]">
              {active.earnedAchievements}/{active.totalAchievements}
            </span>
            <span>成就</span>
          </motion.div>
        </motion.div>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-fit pb-2 flex flex-col items-start gap-4 overflow-auto"
        >
          {active.achievementDetails ? (
            active.achievementDetails.achievements.map((achievement) => (
              <AchievementItem
                key={achievement.name}
                achievement={achievement}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-4">
              成就详情正在缓存中，稍后刷新页面查看。
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

function AchievementItem({
  achievement,
}: { achievement: SteamAchievementDetail }) {
  const showPossibleSpoilerAchievements = useSteamStore(
    (state) => state.showPossibleSpoilerAchievements,
  )

  if (!achievement.achieved || !achievement.unlockTime) {
    return null
  }

  if (!showPossibleSpoilerAchievements && achievement.hidden) {
    return null
  }

  return (
    <div className="flex gap-4 w-full">
      {achievement.iconUrl ? (
        <Image
          src={achievement.iconUrl}
          alt={achievement.displayName}
          width={200}
          height={200}
          className="w-20 h-20 rounded object-cover"
          unoptimized
        />
      ) : (
        <div className="w-20 h-20 rounded bg-secondary" />
      )}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col">
          <div className="font-medium">{achievement.displayName}</div>
          <div className="text-sm text-muted-foreground">
            {achievement.description}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {achievement.unlockTime.split('T')[0]}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between my-auto">
        <div className="text-xs text-muted-foreground">全球达成率</div>
        <div className="text-sm">{achievement.percent.toFixed(1)}%</div>
      </div>
    </div>
  )
}

function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 1000) {
    return `${hours} 小时`
  }
  return `${(hours / 1000).toFixed(1)}k 小时`
}
