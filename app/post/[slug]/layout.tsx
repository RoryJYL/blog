import { Info } from '@/app/components/info'
import MainLayout from '@/app/components/main-layout'
import { PostList } from '@/app/components/post-list'
import TableOfContents from '@/app/components/toc'
import { getPost } from '@/lib/contentplayer-utils'
import { notFound } from 'next/navigation'

type PostPageProps = {
  params: { slug: string }
}

export default function PostLayout({
  children,
  params,
}: React.PropsWithChildren<PostPageProps>) {
  const { slug } = params
  const post = getPost(slug)
  if (!post) {
    notFound()
  }

  return (
    <MainLayout
      left={
        <div className="hidden md:block md:sticky md:top-6">
          <TableOfContents toc={post.toc} />
        </div>
      }
      right={<PostList currentId={post._id} />}
      main={children}
    />
  )
}
