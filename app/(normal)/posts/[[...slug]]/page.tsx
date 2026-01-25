import { Pagination } from '@/app/components/pagination'
import { PostCard } from '@/app/components/post-card'
import {
  POST_PAGE_SIZE,
  getPosts,
  getTotalPostCount,
} from '@/lib/contentplayer-utils'

type PostsPageProps = {
  params: { slug?: string[] }
}

export const generateMetadata = async ({ params }: PostsPageProps) => {
  const { slug } = params
  // 如果没有传入 pageIndex，默认为第1页
  const pageNumber = slug?.[0] || '1'

  return {
    title: `文章列表: 第 ${pageNumber} 页 | Rory's Blog`,
  }
}

export default function Page({ params }: PostsPageProps) {
  const { slug } = params
  // 如果没有传入 pageIndex 或解析失败，默认为第1页
  const pageNumber = slug?.[0] ? Number.parseInt(slug[0], 10) : 1
  const { totalPages, page, posts } = getPosts(pageNumber)

  return (
    <>
      <div className="space-y-6 mb-6">
        {posts.map((post, index) => (
          <PostCard key={post._id} post={post} isFirst={index === 0} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={page} />
    </>
  )
}

export function generateStaticParams() {
  const totalPostCount = getTotalPostCount()
  const pages = Math.ceil(totalPostCount / POST_PAGE_SIZE)

  // 生成所有可能的页面路径参数
  const params = []

  // 添加首页 (posts/)
  params.push({ slug: [] })

  // 添加分页页面 (posts/1, posts/2, etc.)
  for (let i = 1; i <= pages; i += 1) {
    params.push({ slug: [i.toString()] })
  }

  return params
}
