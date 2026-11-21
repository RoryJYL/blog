import { useParams } from 'react-router'
import { Pagination } from '@/app/components/pagination'
import { ThoughtCard } from '@/app/components/thought-card'
import { getThoughts } from '@/lib/content'
import { pageMeta } from '@/lib/meta'

export const meta = ({ params }: { params: { page?: string } }) =>
  pageMeta(`絮语列表: 第 ${params.page ?? '1'} 页 | Rory's Blog`)

export default function Thoughts() {
  const { page } = useParams()
  const pageNumber = page ? Number.parseInt(page, 10) : 1
  const { totalPages, page: currentPage, thoughts } = getThoughts(pageNumber)

  return (
    <>
      <div className="space-y-6 mb-6">
        {thoughts.map((thought) => (
          <ThoughtCard
            key={thought.slug}
            thought={thought}
            href={thought.url}
          />
        ))}
      </div>
      <Pagination
        basePath="/thoughts"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  )
}
