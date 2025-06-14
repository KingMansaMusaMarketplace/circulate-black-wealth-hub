
// Bundle size monitoring and optimization utilities
export const trackBundleMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track initial bundle load time
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      console.log('Bundle Performance Metrics:', {
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart,
        fullLoad: navigationTiming.loadEventEnd - navigationTiming.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      });
    });
  }
};

// Lazy load heavy dependencies only when needed
export const lazyLoadHeavyDeps = {
  // QR code libraries
  qrScanner: () => import('html5-qrcode'),
  qrGenerator: () => import('qrcode'),
  
  // File processing
  fileSaver: () => import('file-saver'),
  htmlToPdf: () => import('html2pdf.js'),
  
  // Image processing
  imageCrop: () => import('react-image-crop'),
  
  // Date utilities (only when needed)
  dateFns: () => import('date-fns'),
};

// Critical CSS extraction helper
export const inlineCriticalCSS = () => {
  // This would typically be handled by build tools, but we can optimize runtime CSS
  const criticalStyles = `
    .container-custom { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .heading-lg { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
    .mansablue { color: #1e40af; }
    .mansagold { color: #fbbf24; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalStyles;
  document.head.insertBefore(style, document.head.firstChild);
};

// Progressive loading strategy
export const progressiveLoad = {
  // Load components based on viewport
  loadAboveFold: () => [
    import('@/components/Hero'),
    import('@/components/navbar/Navbar'),
  ],
  
  loadBelowFold: () => [
    import('@/components/HowItWorks/HowItWorksSteps'),
    import('@/components/TestimonialsSection'),
    import('@/components/Footer'),
  ],
  
  // Load on interaction
  loadOnDemand: {
    dashboard: () => import('@/pages/DashboardPage'),
    directory: () => import('@/pages/DirectoryPage'),
    qrScanner: () => import('@/pages/QRScannerPage'),
  }
};
