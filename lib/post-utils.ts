import type { Post } from 'contentlayer/generated'

export type PostBadge = {
  name: string
  url: string
  isPrimary?: boolean
}

export function getPostBadges({
  category,
  tags,
}: Pick<Post, 'category' | 'tags'>) {
  const badges: PostBadge[] = [
    { name: category, url: `/category/${category}`, isPrimary: true },
    ...tags.map((tag) => ({ name: tag, url: `/tag/${tag}` })),
  ]

  return badges
}
