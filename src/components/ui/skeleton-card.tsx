import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showImage?: boolean;
  showAvatar?: boolean;
}

/**
 * Shimmer skeleton loader for cards
 * Provides visual feedback during loading states
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className,
  lines = 3,
  showImage = false,
  showAvatar = false,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 space-y-4',
        'animate-pulse',
        className
      )}
    >
      {showImage && (
        <div className="w-full h-40 bg-muted rounded-lg skeleton-shimmer" />
      )}
      
      <div className="flex items-center gap-3">
        {showAvatar && (
          <div className="w-10 h-10 rounded-full bg-muted skeleton-shimmer" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 skeleton-shimmer" />
          <div className="h-3 bg-muted rounded w-1/2 skeleton-shimmer" />
        </div>
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-muted rounded skeleton-shimmer"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Grid of skeleton cards for list loading states
 */
export const SkeletonCardGrid: React.FC<{
  count?: number;
  columns?: number;
  showImage?: boolean;
}> = ({ count = 6, columns = 3, showImage = true }) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} showImage={showImage} />
      ))}
    </div>
  );
};

export default SkeletonCard;
