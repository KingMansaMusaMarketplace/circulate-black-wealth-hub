
// Performance tracking utilities
export const trackBundleMetrics = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const metrics = {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      fullLoad: perfData.loadEventEnd - perfData.loadEventStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
    };
    
    console.info('Bundle Performance Metrics:', metrics);
  }
};

// Add resource hints for better loading
export const addResourceHints = () => {
  if (typeof document !== 'undefined') {
    // Preconnect to external domains
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    preconnectUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });
  }
};
