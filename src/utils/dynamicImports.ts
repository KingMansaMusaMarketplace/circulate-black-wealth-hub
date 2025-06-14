
import { lazy } from 'react';

// Dynamic imports for heavy chart libraries
export const loadRechartsComponents = () => {
  return {
    BarChart: lazy(() => import('recharts').then(module => ({ default: module.BarChart }))),
    LineChart: lazy(() => import('recharts').then(module => ({ default: module.LineChart }))),
    PieChart: lazy(() => import('recharts').then(module => ({ default: module.PieChart }))),
    ResponsiveContainer: lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer }))),
  };
};

// Dynamic imports for framer-motion components
export const loadFramerMotion = () => {
  return {
    motion: lazy(() => import('framer-motion').then(module => ({ default: module.motion }))),
    AnimatePresence: lazy(() => import('framer-motion').then(module => ({ default: module.AnimatePresence }))),
  };
};

// Preload critical resources
export const preloadCriticalChunks = () => {
  // Preload auth chunks since they're commonly accessed
  import('@/pages/LoginPage');
  import('@/pages/SignupPage');
  
  // Preload directory chunks since they're main features
  import('@/pages/DirectoryPage');
};

// Bundle performance tracking
export const trackBundleMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track initial bundle load time
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      console.log('Bundle Performance Metrics:', {
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        fullLoad: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      });
    });
  }
};

// Resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetch = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  // Preconnect to external APIs
  const preconnect = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  };

  // Add resource hints
  dnsPrefetch('//fonts.googleapis.com');
  dnsPrefetch('//fonts.gstatic.com');
  preconnect('https://api.supabase.co');
};
