
import React from 'react';
import { Loader2 } from 'lucide-react';
import SkeletonCard from './SkeletonCard';

interface LoadingStateProps {
  itemCount?: number;
  layoutType?: 'grid' | 'list';
  showSpinner?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  itemCount = 6, 
  layoutType = 'grid',
  showSpinner = true
}) => {
  if (showSpinner) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className={layoutType === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
      : "flex flex-col space-y-4"
    }>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard key={index} layoutType={layoutType} index={index} />
      ))}
    </div>
  );
};

export default LoadingState;
