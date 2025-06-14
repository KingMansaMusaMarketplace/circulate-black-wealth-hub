
// Advanced performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private performanceData: Map<string, number> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Track component render times
  trackComponentRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    this.performanceData.set(`${componentName}_render`, renderTime);
    
    if (renderTime > 16.67) { // More than one frame (60fps)
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Optimize scroll performance
  optimizeScrolling() {
    let ticking = false;
    
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Your scroll logic here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }

  // Memory cleanup
  cleanupUnusedResources() {
    // Remove unused event listeners
    const unusedElements = document.querySelectorAll('[data-cleanup="true"]');
    unusedElements.forEach(element => {
      element.removeEventListener('click', () => {});
      element.removeEventListener('scroll', () => {});
    });

    // Clear expired cache entries
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('expired')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }

  // Resource hints optimization
  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'preconnect', href: 'https://placehold.co' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      fullLoad: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      componentMetrics: Object.fromEntries(this.performanceData)
    };
  }
}

// React performance hook
export const usePerformanceTracking = (componentName: string) => {
  const startTime = performance.now();
  
  React.useEffect(() => {
    const optimizer = PerformanceOptimizer.getInstance();
    optimizer.trackComponentRender(componentName, startTime);
  }, [componentName, startTime]);
};
