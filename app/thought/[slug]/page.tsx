import { notFound } from 'next/navigation'
import { ThoughtCard } from '@/app/components/thought-card'
import { getAllThoughtsInfo, getThought } from '@/lib/contentplayer-utils'

type ThoughtPageProps = {
  params: { slug: string }
}

export const generateMetadata = async ({ params }: ThoughtPageProps) => {
  const { slug } = params
  const thought = getThought(slug)

  return {
    title: `${thought?.title} | Rory's Blog`,
  }
}

export default function ThoughtPage({ params }: ThoughtPageProps) {
  const { slug } = params
  const thought = getThought(slug)

  if (!thought) {
    notFound()
  }

  return <ThoughtCard thought={thought} />
}

export function generateStaticParams() {
  const allThoughtSlugs = getAllThoughtsInfo(['slug'])
  return allThoughtSlugs.map((thought) => ({
    slug: thought.slug,
  }))
}
