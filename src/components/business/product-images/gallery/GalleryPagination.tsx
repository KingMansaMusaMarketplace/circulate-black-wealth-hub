
import React from 'react';
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const GalleryPagination: React.FC<GalleryPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className={cn(
              currentPage === 1 ? 'pointer-events-none opacity-50' : '',
              'transition-transform hover:scale-105 focus:scale-105'
            )}
            aria-disabled={currentPage === 1}
            aria-label="Go to previous page"
          />
        </PaginationItem>
        
        {Array.from({length: Math.min(5, totalPages)}).map((_, i) => {
          let pageNum: number;
          
          // Logic to display appropriate page numbers
          if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            // Near the start
            if (i < 4) pageNum = i + 1;
            else pageNum = totalPages;
          } else if (currentPage >= totalPages - 2) {
            // Near the end
            if (i === 0) pageNum = 1;
            else pageNum = totalPages - (4 - i);
          } else {
            // In the middle
            pageNum = currentPage - 2 + i;
            if (i === 0) pageNum = 1;
            if (i === 4) pageNum = totalPages;
          }
          
          // Show ellipsis instead of certain page numbers
          if ((totalPages > 5) && 
              ((i === 1 && currentPage > 3) || 
               (i === 3 && currentPage < totalPages - 2))) {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNum)}
                isActive={currentPage === pageNum}
                className={cn(
                  'transition-transform hover:scale-105 focus:scale-105',
                  currentPage === pageNum ? 'animate-pulse-gold' : ''
                )}
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className={cn(
              currentPage === totalPages ? 'pointer-events-none opacity-50' : '',
              'transition-transform hover:scale-105 focus:scale-105'
            )}
            aria-disabled={currentPage === totalPages}
            aria-label="Go to next page"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GalleryPagination;
