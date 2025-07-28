import React, { useEffect, useCallback, useRef } from 'react';
import { debounce, throttle, measureWebVitals, trackMemoryUsage } from '@/utils/performance';

export const usePerformanceOptimization = () => {
  const cleanupRef = useRef<(() => void)[]>([]);

  // Memory leak prevention
  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  }, []);

  // Optimized event handlers
  const createOptimizedHandler = useCallback((
    handler: (...args: any[]) => void,
    delay: number = 300,
    type: 'debounce' | 'throttle' = 'debounce'
  ) => {
    const optimizedHandler = type === 'debounce' 
      ? debounce(handler, delay)
      : throttle(handler, delay);
    
    return optimizedHandler;
  }, []);

  // Memory monitoring
  const startMemoryMonitoring = useCallback(() => {
    const interval = setInterval(() => {
      const memory = trackMemoryUsage();
      if (memory && memory.used > 100) { // Alert if over 100MB
        console.warn(`High memory usage detected: ${memory.used}MB`);
      }
    }, 30000); // Check every 30 seconds

    addCleanup(() => clearInterval(interval));
  }, [addCleanup]);

  // Performance monitoring
  useEffect(() => {
    // Initialize Web Vitals monitoring
    measureWebVitals();
    
    // Start memory monitoring
    startMemoryMonitoring();
    
    // Cleanup on unmount
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, [startMemoryMonitoring]);

  return {
    createOptimizedHandler,
    addCleanup
  };
};

// Hook for component memoization
export const useMemoizedComponent = <T>(
  component: React.ComponentType<T>,
  dependencies: React.DependencyList = []
) => {
  return React.useMemo(() => React.memo(component), dependencies);
};

// Hook for optimized state updates
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = React.useState(initialValue);
  
  const optimizedSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as Function)(prev) : value;
      
      // Only update if value actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newValue)) {
        return newValue;
      }
      return prev;
    });
  }, []);

  return [state, optimizedSetState] as const;
};

// Hook for lazy loading images
export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return { imageSrc, isLoaded, imgRef, handleLoad };
};