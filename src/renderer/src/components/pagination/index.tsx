import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@renderer/lib/utils'
import { getPaginationPages } from '@renderer/utils'

type PaginationComponentProps = {
  page: number
  setPage: (page: number) => void
  totalPages: number
}

export const PaginationComponent = ({ page, setPage, totalPages }: PaginationComponentProps) => {
  const paginationPages = getPaginationPages(page, totalPages)
  return (
    <Pagination className="h-full">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(1, page - 1))}
            className="cursor-pointer text-base hover:bg-secondary/10"
          />
        </PaginationItem>

        {paginationPages.map((p, i) => (
          <PaginationItem key={i}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
                className={cn(
                  'cursor-pointer border text-base hover:bg-secondary/10 hover:font-semibold',
                  page === p &&
                    'bg-secondary/90 hover:bg-secondary/90 hover:text-foreground text-foreground font-semibold'
                )}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className="cursor-pointer text-base hover:bg-secondary/10"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
