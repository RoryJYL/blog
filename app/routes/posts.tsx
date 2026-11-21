import { useParams } from 'react-router'
import { Pagination } from '@/app/components/pagination'
import { PostCard } from '@/app/components/post-card'
import { getPosts } from '@/lib/content'
import { pageMeta } from '@/lib/meta'

export const meta = ({ params }: { params: { page?: string } }) =>
  pageMeta(`文章列表: 第 ${params.page ?? '1'} 页 | Rory's Blog`)

export default function Posts() {
  const { page } = useParams()
  const pageNumber = page ? Number.parseInt(page, 10) : 1
  const { totalPages, page: currentPage, posts } = getPosts(pageNumber)

  return (
    <>
      <div className="space-y-6 mb-6">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} isFirst={index === 0} />
        ))}
      </div>
      <Pagination
        basePath="/posts"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  )
}
