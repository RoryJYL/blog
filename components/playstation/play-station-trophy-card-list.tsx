'use client'

import { useOutsideClick } from '@/hooks/use-outside-click'
import type { Game, TrophyDetail } from '@/lib/playstationTypes'
import dayjs from 'dayjs'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { usePlaystationStore } from '../playstation-store-provider'
import { PlatformIcon } from './platform-icon'
import { TrophyIcon } from './trophy'

const showTrophies = ['platinum', 'gold', 'silver', 'bronze'] as const

interface PlayStationTrophyCardListProps {
  games: Game[]
}

export default function PlayStationTrophyCardList({
  games,
}: PlayStationTrophyCardListProps) {
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
            <motion.button
              key={`button-${active.title}-${id}`}
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
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="relative w-[95%] max-w-[500px] h-[85%] md:h-[90%] flex flex-col rounded-xl overflow-hidden"
            >
              <ListCard active={active} id={id} />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <motion.div
            layoutId={`card-${game.title}-${id}`}
            key={`card-${game.title}-${id}`}
            onClick={() => setActive(game)}
            className="flex gap-2 border rounded-md p-4 items-center cursor-pointer"
          >
            <motion.div
              layoutId={`image-${game.title}-${id}`}
              className="w-20 h-20 relative shrink-0 overflow-hidden rounded"
            >
              {game.platform !== 'PS5' && (
                <Image
                  src={game.iconUrl}
                  alt={game.title}
                  fill
                  className="object-cover blur-sm"
                />
              )}
              <Image
                src={game.iconUrl}
                alt={game.title}
                fill
                className="object-contain"
              />
              <PlatformIcon
                platform={game.platform}
                className="absolute bottom-0 left-0 right-0 w-full h-[14px] bg-foreground/80 text-background flex items-center justify-center"
              />
            </motion.div>
            <div className="flex flex-col justify-between h-full overflow-hidden">
              <div>
                <motion.div
                  layoutId={`title-${game.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {game.title}
                </motion.div>
                <motion.div
                  layoutId={`trophies-${game.title}-${id}`}
                  className="flex items-center gap-2"
                >
                  {showTrophies.map((trophy) => (
                    <TrophyIcon
                      key={trophy}
                      type={trophy}
                      count={game.earnedTrophies[trophy]}
                    />
                  ))}
                </motion.div>
              </div>
              <div className="text-sm text-muted-foreground">
                {dayjs(game.earnedDate).format('YYYY-MM-DD')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function ListCard({ active, id }: { active: Game; id: string }) {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: scrollContainer })
  const stop = useTransform(scrollY, [0, 288], [35, 0])
  const bg = useMotionTemplate`
    linear-gradient(transparent, var(--color-secondary) ${stop}%)
  `
  const paddingTop = useTransform(scrollY, [0, 288], [0, 16])

  return (
    <>
      <motion.div
        layoutId={`image-${active.title}-${id}`}
        className="absolute top-0 left-0 right-0"
      >
        <Image
          width={200}
          height={200}
          src={active.iconUrl}
          alt={active.title}
          className="w-full h-72 rounded-tr-lg rounded-tl-lg object-cover"
        />
      </motion.div>

      <motion.div
        ref={scrollContainer}
        className="px-4 pb-4 relative overflow-auto"
        style={{ background: bg }}
      >
        <motion.div
          className="sticky top-0 mt-72 bg-secondary pb-4 flex flex-col gap-y-1 z-10"
          style={{ paddingTop: paddingTop }}
        >
          <motion.div
            layoutId={`title-${active.title}-${id}`}
            className="font-bold text-lg"
          >
            {active.title}
          </motion.div>
          <motion.div
            layoutId={`trophies-${active.title}-${id}`}
            className="flex items-center gap-2"
          >
            {showTrophies.map((trophy) => (
              <TrophyIcon
                key={trophy}
                type={trophy}
                count={active.earnedTrophies[trophy]}
              />
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-fit pb-2 flex flex-col items-start gap-4 overflow-auto"
        >
          {active.trophyDetails.trophies.map((trophy) => (
            <TrophyItem key={trophy.trophyId} trophy={trophy} />
          ))}
        </motion.div>
      </motion.div>
    </>
  )
}

function TrophyItem({ trophy }: { trophy: TrophyDetail }) {
  const showPossibleSpoilerTrophies = usePlaystationStore(
    (state) => state.showPossibleSpoilerTrophies,
  )

  if (!showPossibleSpoilerTrophies && trophy.trophyHidden) {
    return null
  }

  return (
    <div className="flex gap-4 w-full">
      <Image
        src={trophy.trophyIconUrl}
        alt={trophy.trophyName}
        width={200}
        height={200}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col">
          <div className="font-medium">{trophy.trophyName}</div>
          <div className="text-sm text-muted-foreground">
            {trophy.trophyDetail}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {dayjs(trophy.earnedDateTime).format('YYYY-MM-DD')}
        </div>
      </div>
      <Image
        src={`https://ab84760.webp.li/play-station/${trophy.trophyType}.png`}
        alt={trophy.trophyType}
        width={100}
        height={100}
        className="object-contain my-auto w-12 h-12"
      />
    </div>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
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
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <title>Close</title>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}

const cards = [
  {
    description: 'Lana Del Rey',
    title: 'Summertime Sadness',
    src: 'https://assets.aceternity.com/demos/lana-del-rey.jpeg',
    ctaText: 'Play',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style. Born Elizabeth Woolridge
          Grant in New York City, she has captivated audiences worldwide with
          her haunting voice and introspective lyrics. <br /> <br /> Her songs
          often explore themes of tragic romance, glamour, and melancholia,
          drawing inspiration from both contemporary and vintage pop culture.
          With a career that has seen numerous critically acclaimed albums, Lana
          Del Rey has established herself as a unique and influential figure in
          the music industry, earning a dedicated fan base and numerous
          accolades.
        </p>
      )
    },
  },
  {
    description: 'Babbu Maan',
    title: 'Mitran Di Chhatri',
    src: 'https://assets.aceternity.com/demos/babbu-maan.jpeg',
    ctaText: 'Play',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry. <br /> <br /> His songs
          often reflect the struggles and triumphs of everyday life, capturing
          the essence of Punjabi culture and traditions. With a career spanning
          over two decades, Babu Maan has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      )
    },
  },

  {
    description: 'Metallica',
    title: 'For Whom The Bell Tolls',
    src: 'https://assets.aceternity.com/demos/metallica.jpeg',
    ctaText: 'Play',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry. <br /> <br /> Their
          songs often reflect themes of aggression, social issues, and personal
          struggles, capturing the essence of the heavy metal genre. With a
          career spanning over four decades, Metallica has released numerous hit
          albums and singles that have garnered them a massive fan following
          both in the United States and abroad.
        </p>
      )
    },
  },
  {
    description: 'Led Zeppelin',
    title: 'Stairway To Heaven',
    src: 'https://assets.aceternity.com/demos/led-zeppelin.jpeg',
    ctaText: 'Play',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          Led Zeppelin, a legendary British rock band, is renowned for their
          innovative sound and profound impact on the music industry. Formed in
          London in 1968, they have become a cultural icon in the rock music
          world. <br /> <br /> Their songs often reflect a blend of blues, hard
          rock, and folk music, capturing the essence of the 1970s rock era.
          With a career spanning over a decade, Led Zeppelin has released
          numerous hit albums and singles that have garnered them a massive fan
          following both in the United Kingdom and abroad.
        </p>
      )
    },
  },
  {
    description: 'Mustafa Zahid',
    title: 'Toh Phir Aao',
    src: 'https://assets.aceternity.com/demos/toh-phir-aao.jpeg',
    ctaText: 'Play',
    ctaLink: 'https://ui.aceternity.com/templates',
    content: () => {
      return (
        <p>
          &quot;Aawarapan&quot;, a Bollywood movie starring Emraan Hashmi, is
          renowned for its intense storyline and powerful performances. Directed
          by Mohit Suri, the film has become a significant work in the Indian
          film industry. <br /> <br /> The movie explores themes of love,
          redemption, and sacrifice, capturing the essence of human emotions and
          relationships. With a gripping narrative and memorable music,
          &quot;Aawarapan&quot; has garnered a massive fan following both in
          India and abroad, solidifying Emraan Hashmi&apos;s status as a
          versatile actor.
        </p>
      )
    },
  },
]
