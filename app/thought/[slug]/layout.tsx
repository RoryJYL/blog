import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'
import { getAllThoughtsInfo, getThought } from '@/lib/contentplayer-utils'
import { notFound } from 'next/navigation'

type ThoughtPageProps = {
  params: { slug: string }
}

export default function ThoughtLayout({
  children,
  params,
}: React.PropsWithChildren<ThoughtPageProps>) {
  const { slug } = params
  const thought = getThought(slug)
  if (!thought) {
    notFound()
  }

  return (
    <MainLayout left={<PostList currentId={thought._id} />} main={children} />
  )
}
