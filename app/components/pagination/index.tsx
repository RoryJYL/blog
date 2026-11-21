import { useCallback } from 'react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as PaginationUI,
} from '@/components/ui/pagination'
import { cn } from '@/lib/tailwind-utils'

type PaginationProps = {
  /** 列表页的索引路径，如 /posts、/thoughts；第 1 页就是它，不再拼 /1 */
  basePath: string
  totalPages: number
  currentPage: number
}

export function Pagination({
  basePath,
  totalPages,
  currentPage,
}: PaginationProps) {
  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}/${page}`

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
      {/* 上一页按钮：边界处渲染成 span，避免产生指向不存在页面的链接 */}
      {currentPage > 1 ? (
        <Link
          to={pageHref(currentPage - 1)}
          className={cn(buttonVariants({ variant: 'ghost' }), 'font-normal')}
        >
          上一页
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'ghost' }), 'invisible')}>
          上一页
        </span>
      )}

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
                <Link
                  to={pageHref(page)}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9',
                  )}
                >
                  {page}
                </Link>
              )}
            </PaginationItem>
          ),
        )}
      </PaginationContent>

      {/* 下一页按钮 */}
      {currentPage < totalPages ? (
        <Link
          to={pageHref(currentPage + 1)}
          className={cn(buttonVariants({ variant: 'ghost' }), 'font-normal')}
        >
          下一页
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'ghost' }), 'invisible')}>
          下一页
        </span>
      )}
    </PaginationUI>
  )
}
