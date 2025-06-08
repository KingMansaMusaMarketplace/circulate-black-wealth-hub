
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  pagination: {
    page: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  isMobile: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  setPage,
  isMobile
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="flex gap-2">
        {pagination.page > 1 && (
          <Button
            variant="outline"
            onClick={() => setPage(pagination.page - 1)}
            size={isMobile ? "sm" : "default"}
          >
            Previous
          </Button>
        )}
        
        <span className="flex items-center px-4 text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        
        {pagination.page < pagination.totalPages && (
          <Button
            variant="outline"
            onClick={() => setPage(pagination.page + 1)}
            size={isMobile ? "sm" : "default"}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaginationControls;
