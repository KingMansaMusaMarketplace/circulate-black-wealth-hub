
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  lazy = true,
  quality = 'medium',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP and fallback sources
  const generateSources = (originalSrc: string) => {
    // Normalize placeholder URLs from published domain to relative paths
    const placeholderPrefix = 'https://circulate-black-wealth-hub.lovable.app/images/placeholders/';
    let normalizedSrc = originalSrc;
    if (originalSrc.startsWith(placeholderPrefix)) {
      normalizedSrc = '/images/placeholders/' + originalSrc.substring(placeholderPrefix.length);
    }

    // Skip conversion for placeholders, data URLs, and local files
    if (normalizedSrc.includes('placehold.co') || normalizedSrc.startsWith('data:') || normalizedSrc.startsWith('/')) {
      return { webp: normalizedSrc, fallback: normalizedSrc };
    }

    // For external URLs, try to generate WebP version
    const webpSrc = normalizedSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return { webp: webpSrc, fallback: normalizedSrc };
  };

  useEffect(() => {
    const sources = generateSources(src);
    
    if (!lazy) {
      setIsVisible(true);
      setCurrentSrc(sources.webp);
      return;
    }

    const currentImg = imgRef.current;
    if (!currentImg) return;

    // Check if already in viewport (fixes mobile Safari race condition)
    const rect = currentImg.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
    if (isAlreadyVisible) {
      setIsVisible(true);
      setCurrentSrc(sources.webp);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setCurrentSrc(sources.webp);
          observer.unobserve(currentImg);
        }
      },
      { threshold: 0.01, rootMargin: '100px' }
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
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else if (!hasError) {
      // Try the original source if WebP fails
      const sources = generateSources(src);
      if (currentSrc !== sources.fallback) {
        setCurrentSrc(sources.fallback);
      } else {
        setHasError(true);
      }
    }
  };

  const qualityClass = {
    low: 'filter brightness-90 contrast-95',
    medium: '',
    high: 'filter brightness-105 contrast-105 saturate-105'
  }[quality];

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      {/* Loading skeleton */}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" 
             style={{ backgroundSize: '200% 100%' }} />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded"></div>
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
        className={cn(
          'transition-all duration-300 w-full h-full object-cover',
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
