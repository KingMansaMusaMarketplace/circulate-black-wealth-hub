import React, { useRef, useState, useEffect, Suspense } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** How far before the viewport to start loading (px). Default 200. */
  rootMargin?: string;
  /** Minimum height placeholder to prevent layout shift */
  minHeight?: string;
}

const DefaultFallback = ({ minHeight }: { minHeight: string }) => (
  <div className={`${minHeight}`} />
);

/**
 * Defers mounting of children until the section is near the viewport.
 * Combines IntersectionObserver with React.Suspense for lazy-loaded components.
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  rootMargin = '300px',
  minHeight = 'min-h-[100px]',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <DefaultFallback minHeight={minHeight} />
      )}
    </div>
  );
};

export default LazySection;
