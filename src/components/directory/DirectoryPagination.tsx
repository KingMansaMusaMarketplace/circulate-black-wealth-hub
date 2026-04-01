
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DirectoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DirectoryPagination: React.FC<DirectoryPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <Pagination className="mt-8">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={cn(
              'cursor-pointer text-base font-medium px-4 py-2 h-auto',
              currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-accent'
            )}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="h-10 w-10 text-muted-foreground" />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
                size="default"
                className={cn(
                  'cursor-pointer min-w-[2.75rem] h-10 text-base font-semibold rounded-lg',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn(
              'cursor-pointer text-base font-medium px-4 py-2 h-auto',
              currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-accent'
            )}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DirectoryPagination;
