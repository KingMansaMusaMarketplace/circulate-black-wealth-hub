
import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`[Performance] ${entry.name}: ${entry.duration}ms`);
        
        // Log slow operations
        if (entry.duration > 1000) {
          console.warn(`[Performance Warning] Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log('[Memory] Used:', Math.round(memoryInfo.usedJSHeapSize / 1048576), 'MB');
      console.log('[Memory] Total:', Math.round(memoryInfo.totalJSHeapSize / 1048576), 'MB');
      console.log('[Memory] Limit:', Math.round(memoryInfo.jsHeapSizeLimit / 1048576), 'MB');
    }
    
    // Monitor network connectivity
    const handleOnline = () => console.log('[Network] Back online');
    const handleOffline = () => console.log('[Network] Gone offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return null;
};

export default PerformanceMonitor;
