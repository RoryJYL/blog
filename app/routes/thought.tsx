import { useParams } from 'react-router'
import { AdjacentNav } from '@/app/components/adjacent-nav'
import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'
import { ThoughtCard } from '@/app/components/thought-card'
import { getAdjacentThoughts, getThought } from '@/lib/content'
import { pageMeta } from '@/lib/meta'
import NotFound from './not-found'

export const meta = ({ params }: { params: { slug: string } }) => {
  const thought = getThought(params.slug)

  return pageMeta(
    thought ? `${thought.title} | Rory's Blog` : "页面不存在 | Rory's blog",
  )
}

export default function Thought() {
  const { slug } = useParams()
  const thought = slug ? getThought(slug) : undefined

  if (!thought) {
    return <NotFound />
  }

  const { previous, next } = getAdjacentThoughts(thought.slug)

  return (
    <MainLayout
      left={<PostList currentSlug={thought.slug} />}
      main={
        <>
          <ThoughtCard thought={thought} />
          <AdjacentNav previous={previous} next={next} />
        </>
      }
    />
  )
}
