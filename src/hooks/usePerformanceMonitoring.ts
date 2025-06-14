
import { useState, useEffect } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectMetrics = () => {
      const optimizer = PerformanceOptimizer.getInstance();
      const summary = optimizer.getPerformanceSummary();
      
      // Collect Web Vitals
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const metricsData: Partial<PerformanceMetrics> = {
          loadTime: summary.fullLoad,
          firstPaint: summary.firstPaint,
          firstContentfulPaint: summary.firstContentfulPaint,
        };

        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              metricsData.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input':
              metricsData.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                metricsData.cumulativeLayoutShift = (metricsData.cumulativeLayoutShift || 0) + (entry as any).value;
              }
              break;
          }
        });

        setMetrics(metricsData as PerformanceMetrics);
        setIsLoading(false);
      });

      // Observe Core Web Vitals
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    };

    const cleanup = collectMetrics();
    return cleanup;
  }, []);

  const getPerformanceGrade = (): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (!metrics) return 'F';
    
    const { firstContentfulPaint, largestContentfulPaint, cumulativeLayoutShift, firstInputDelay } = metrics;
    
    let score = 0;
    
    // FCP scoring (0-25 points)
    if (firstContentfulPaint < 1800) score += 25;
    else if (firstContentfulPaint < 3000) score += 15;
    else if (firstContentfulPaint < 4200) score += 5;
    
    // LCP scoring (0-25 points)
    if (largestContentfulPaint < 2500) score += 25;
    else if (largestContentfulPaint < 4000) score += 15;
    else if (largestContentfulPaint < 5500) score += 5;
    
    // CLS scoring (0-25 points)
    if (cumulativeLayoutShift < 0.1) score += 25;
    else if (cumulativeLayoutShift < 0.25) score += 15;
    else if (cumulativeLayoutShift < 0.4) score += 5;
    
    // FID scoring (0-25 points)
    if (firstInputDelay < 100) score += 25;
    else if (firstInputDelay < 300) score += 15;
    else if (firstInputDelay < 500) score += 5;
    
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return {
    metrics,
    isLoading,
    performanceGrade: getPerformanceGrade(),
  };
};
