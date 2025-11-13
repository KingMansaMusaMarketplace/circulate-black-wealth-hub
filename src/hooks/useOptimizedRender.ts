import { useRef, useEffect } from 'react';

/**
 * Hook to detect excessive re-renders and warn in development
 */
export const useOptimizedRender = (componentName: string, maxRenders = 50) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  renderCount.current += 1;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const elapsed = Date.now() - startTime.current;
      
      // Warn if component renders excessively in a short time
      if (renderCount.current > maxRenders && elapsed < 5000) {
        console.warn(
          `⚠️ ${componentName} has rendered ${renderCount.current} times in ${elapsed}ms. Consider optimization with React.memo or useMemo.`
        );
      }
    }
  });

  return renderCount.current;
};
