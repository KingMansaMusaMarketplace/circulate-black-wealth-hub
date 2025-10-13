import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'shimmer';
}

/**
 * Enhanced loading skeleton with shimmer animation
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'shimmer',
}) => {
  return (
    <div
      className={cn(
        'rounded-md bg-muted',
        variant === 'shimmer' && 'skeleton-shimmer',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

/**
 * Business Card Loading Skeleton
 */
export const BusinessCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <LoadingSkeleton className="h-32 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

/**
 * Dashboard Stats Loading Skeleton
 */
export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-2">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-32" />
          <LoadingSkeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
};

/**
 * Table Loading Skeleton
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        {[...Array(cols)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {[...Array(cols)].map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * List Loading Skeleton
 */
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded">
          <LoadingSkeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Profile Loading Skeleton
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <LoadingSkeleton className="h-10 w-full" />
        <LoadingSkeleton className="h-10 w-full" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
    </div>
  );
};
