import { notFound } from 'next/navigation'
import { AdjacentNav } from '@/app/components/adjacent-nav'
import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'
import { getAdjacentThoughts, getThought } from '@/lib/contentplayer-utils'

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

  const { previous, next } = getAdjacentThoughts(slug)

  return (
    <MainLayout
      left={<PostList currentId={thought._id} />}
      main={
        <>
          {children}
          <AdjacentNav previous={previous} next={next} />
        </>
      }
    />
  )
}
