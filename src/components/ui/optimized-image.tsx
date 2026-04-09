
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  /** Additional fallback sources to try in order before giving up */
  fallbackChain?: string[];
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackChain = [],
  lazy = true,
  quality = 'medium',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Build full fallback list: fallbackSrc first, then chain items
  const allFallbacks = React.useMemo(() => {
    const list: string[] = [];
    if (fallbackSrc) list.push(fallbackSrc);
    list.push(...fallbackChain.filter(f => f && f !== fallbackSrc));
    return list;
  }, [fallbackSrc, fallbackChain]);

  // Normalize src — no WebP conversion (external URLs don't support it,
  // causing failed requests and double-loading delays)
  const normalizeSrc = (originalSrc: string): string => {
    const placeholderPrefix = 'https://circulate-black-wealth-hub.lovable.app/images/placeholders/';
    if (originalSrc.startsWith(placeholderPrefix)) {
      return '/images/placeholders/' + originalSrc.substring(placeholderPrefix.length);
    }
    return originalSrc;
  };

  useEffect(() => {
    const normalizedSrc = normalizeSrc(src);
    
    if (!lazy) {
      setIsVisible(true);
      setCurrentSrc(normalizedSrc);
      return;
    }

    const currentImg = imgRef.current;
    if (!currentImg) return;

    // Check if already in viewport or near it (fixes mobile Safari race condition)
    const rect = currentImg.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight + 400 && rect.bottom > -100;
    if (isAlreadyVisible) {
      setIsVisible(true);
      setCurrentSrc(normalizedSrc);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setCurrentSrc(normalizedSrc);
          observer.unobserve(currentImg);
        }
      },
      { threshold: 0.01, rootMargin: '400px' }
    );

    observer.observe(currentImg);

    return () => {
      if (currentImg) observer.unobserve(currentImg);
    };
  }, [src, lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (fallbackIndex < allFallbacks.length) {
      const nextFallback = allFallbacks[fallbackIndex];
      if (nextFallback && currentSrc !== nextFallback) {
        setCurrentSrc(nextFallback);
        setFallbackIndex(prev => prev + 1);
        return;
      }
      setFallbackIndex(prev => prev + 1);
    }
    setHasError(true);
  };

  const qualityClass = {
    low: 'filter brightness-90 contrast-95',
    medium: '',
    high: 'filter brightness-105 contrast-105 saturate-105'
  }[quality];

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {/* Loading skeleton */}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse" 
             style={{ backgroundSize: '200% 100%' }} />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-muted-foreground/20 rounded"></div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Optimized image */}
      <img
        ref={imgRef}
        src={isVisible ? currentSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        fetchPriority={lazy ? 'low' : 'high'}
        className={cn(
          'transition-opacity duration-150 w-full h-full object-cover',
          isLoaded ? 'opacity-100' : 'opacity-0',
          qualityClass,
          className
        )}
        loading={lazy ? 'lazy' : 'eager'}
        sizes={sizes}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
