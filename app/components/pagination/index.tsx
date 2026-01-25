import { Button, buttonVariants } from '@/components/ui/button'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationUI,
} from '@/components/ui/pagination'
import { cn } from '@/lib/tailwind-utils'
import Link from 'next/link'
import { useCallback } from 'react'

type PaginationProps = {
  totalPages: number
  currentPage: number
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const getPageNumbers = useCallback(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis-before' | 'ellipsis-after')[] = [1]

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      pages.push('ellipsis-before')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis-after')
    }

    pages.push(totalPages)

    return pages
  }, [totalPages, currentPage])

  const pageNumbers = getPageNumbers()

  return (
    <PaginationUI className="flex justify-between items-center">
      {/* 上一页按钮 */}
      <Link
        href={currentPage === 2 ? '/' : `/posts/${currentPage - 1}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          currentPage > 1 ? 'visible' : 'invisible',
          'font-normal',
        )}
      >
        上一页
      </Link>

      {/* 页码部分 */}
      <PaginationContent>
        {pageNumbers.map((page, index) =>
          page === 'ellipsis-before' || page === 'ellipsis-after' ? (
            <PaginationItem key={`${page}-${index}`}>
              <PaginationEllipsis>…</PaginationEllipsis>
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              {page === currentPage ? (
                // 当前页不渲染为链接，使用 span
                <span
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'cursor-pointer',
                  )}
                >
                  {page}
                </span>
              ) : (
                <PaginationLink href={page === 1 ? '/' : `/posts/${page}`}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ),
        )}
      </PaginationContent>

      {/* 下一页按钮 */}
      <Link
        href={`/posts/${currentPage + 1}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          currentPage < totalPages ? 'visible' : 'invisible',
          'font-normal',
        )}
      >
        下一页
      </Link>
    </PaginationUI>
  )
}
