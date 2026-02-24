
// Cache optimization utilities - SW registration removed to prevent stale asset caching
export const initializeCaching = () => {
  // Actively unregister any lingering service workers to prevent old versions
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }
};

// Preload key resources
export const preloadResources = () => {
  const criticalResources = [
    { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' },
    { href: '/css/critical.css', as: 'style' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.as === 'font') link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Add performance observer for monitoring
export const initializePerformanceMonitoring = () => {
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('Performance metric:', entry.entryType, entry);
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });
  }
};
