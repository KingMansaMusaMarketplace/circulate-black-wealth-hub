
import React, { Suspense } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  className,
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const { elementRef, isVisible } = useLazyLoading({ threshold, rootMargin });

  const defaultFallback = (
    <div className="space-y-4 p-8">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazySection;
