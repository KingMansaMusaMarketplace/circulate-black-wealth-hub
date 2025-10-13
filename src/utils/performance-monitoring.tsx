/**
 * Performance Monitoring Utilities
 * Track and analyze application performance metrics
 */

import React from 'react';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PageLoadMetrics {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  dom: number;
  load: number;
  total: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;

  private constructor() {
    this.setupPerformanceObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Set up performance observers for Core Web Vitals
   */
  private setupPerformanceObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, {
          rating: this.getLCPRating(lastEntry.startTime),
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.recordMetric('FID', fid, {
            rating: this.getFIDRating(fid),
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue, {
              rating: this.getCLSRating(clsValue),
            });
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}:`, value, metadata);
    }
  }

  /**
   * Get page load metrics
   */
  getPageLoadMetrics(): PageLoadMetrics | null {
    if (typeof window === 'undefined' || !window.performance?.timing) {
      return null;
    }

    const timing = window.performance.timing;
    const navigation = timing.navigationStart;

    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      dom: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      load: timing.loadEventEnd - timing.loadEventStart,
      total: timing.loadEventEnd - navigation,
    };
  }

  /**
   * Measure component render time
   */
  measureRender(componentName: string, callback: () => void) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.recordMetric(`Render: ${componentName}`, duration, {
      component: componentName,
      rating: duration > 16 ? 'slow' : duration > 8 ? 'medium' : 'fast',
    });

    return duration;
  }

  /**
   * Measure async operation
   */
  async measureAsync<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, { error: true });
      throw error;
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return this.metrics;
  }

  /**
   * Get average metric value
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  /**
   * Rating helpers for Core Web Vitals
   */
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitoring = () => {
  const recordMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    performanceMonitor.recordMetric(name, value, metadata);
  };

  const measureRender = (componentName: string, callback: () => void) => {
    return performanceMonitor.measureRender(componentName, callback);
  };

  const measureAsync = <T,>(name: string, operation: () => Promise<T>) => {
    return performanceMonitor.measureAsync(name, operation);
  };

  return { recordMetric, measureRender, measureAsync };
};

/**
 * HOC to measure component render time
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric(`Mount: ${componentName}`, duration);
    }, []);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
};
