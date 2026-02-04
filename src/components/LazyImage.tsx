import React, { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { generateBlurPlaceholder, createImageSrcSet, generateSizesAttr } from '@/utils/imageOptimizer';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  threshold?: number;
  /** Enable blur-up effect with LQIP */
  blurUp?: boolean;
  /** Responsive breakpoints for sizes attribute */
  sizeBreakpoints?: { [key: string]: string };
  /** Priority loading (skip lazy loading) */
  priority?: boolean;
  /** Aspect ratio for placeholder sizing */
  aspectRatio?: string;
}

/**
 * Optimized LazyImage component with:
 * - Intersection observer for viewport-based loading
 * - Blur-up placeholder effect
 * - Responsive srcset support
 * - Priority loading option for critical images
 */
export const LazyImage = React.memo<LazyImageProps>(({
  src,
  alt,
  className,
  placeholderClassName,
  rootMargin = '100px',
  threshold = 0.01,
  blurUp = true,
  sizeBreakpoints,
  priority = false,
  aspectRatio,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized attributes
  const srcSet = createImageSrcSet(src);
  const sizes = sizeBreakpoints ? generateSizesAttr(sizeBreakpoints) : undefined;
  const blurPlaceholder = blurUp ? generateBlurPlaceholder() : undefined;

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [rootMargin, threshold, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      className={cn("relative overflow-hidden", aspectRatio && `aspect-[${aspectRatio}]`)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder - shows while loading */}
      {blurUp && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100',
            placeholderClassName
          )}
          style={{ 
            backgroundImage: `url(${blurPlaceholder})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Shimmer fallback for non-blur mode */}
      {!blurUp && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 shimmer bg-muted',
            placeholderClassName
          )}
        />
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        srcSet={isInView && srcSet !== src ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-500',
          isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';
