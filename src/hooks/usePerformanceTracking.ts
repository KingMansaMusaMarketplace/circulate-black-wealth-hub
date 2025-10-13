import { useEffect, useRef } from 'react';
import { performanceMonitor } from '@/utils/performance-monitoring';

/**
 * Hook to track component mount and render performance
 */
export const usePerformanceTracking = (componentName: string) => {
  const mountTimeRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    // Track mount time
    const mountDuration = performance.now() - mountTimeRef.current;
    performanceMonitor.recordMetric(`Mount: ${componentName}`, mountDuration, {
      component: componentName,
      type: 'mount',
    });

    return () => {
      // Track total renders on unmount
      performanceMonitor.recordMetric(`Total Renders: ${componentName}`, renderCountRef.current, {
        component: componentName,
        type: 'render-count',
      });
    };
  }, [componentName]);

  // Track each render
  useEffect(() => {
    renderCountRef.current += 1;
    
    if (renderCountRef.current > 10 && process.env.NODE_ENV === 'development') {
      console.warn(
        `${componentName} has rendered ${renderCountRef.current} times. Consider optimization.`
      );
    }
  });

  return {
    renderCount: renderCountRef.current,
    mountTime: mountTimeRef.current,
  };
};
