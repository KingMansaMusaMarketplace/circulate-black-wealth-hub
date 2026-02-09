/**
 * Web Vitals Context
 * Centralized tracking for Core Web Vitals with PostHog integration
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import posthog from 'posthog-js';

// Web Vital metric types
export interface WebVitalMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'INP' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Thresholds based on Google's Core Web Vitals standards
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// Get rating based on metric value and thresholds
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export interface WebVitalsState {
  LCP: WebVitalMetric | null;
  FID: WebVitalMetric | null;
  CLS: WebVitalMetric | null;
  INP: WebVitalMetric | null;
  FCP: WebVitalMetric | null;
  TTFB: WebVitalMetric | null;
  overallScore: number | null;
  overallRating: 'good' | 'needs-improvement' | 'poor' | null;
}

interface WebVitalsContextType {
  metrics: WebVitalsState;
  isCollecting: boolean;
  reportMetric: (metric: WebVitalMetric) => void;
  getPerformanceGrade: () => 'A' | 'B' | 'C' | 'D' | 'F';
}

const initialState: WebVitalsState = {
  LCP: null,
  FID: null,
  CLS: null,
  INP: null,
  FCP: null,
  TTFB: null,
  overallScore: null,
  overallRating: null,
};

const WebVitalsContext = createContext<WebVitalsContextType | undefined>(undefined);

export const WebVitalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<WebVitalsState>(initialState);
  const [isCollecting, setIsCollecting] = useState(true);

  // Report metric to PostHog and update state
  const reportMetric = useCallback((metric: WebVitalMetric) => {
    setMetrics(prev => {
      const updated = {
        ...prev,
        [metric.name]: metric,
      };
      
      // Calculate overall score based on Core Web Vitals (LCP, FID/INP, CLS)
      const scores: number[] = [];
      
      if (updated.LCP) {
        const lcpScore = updated.LCP.rating === 'good' ? 100 : updated.LCP.rating === 'needs-improvement' ? 50 : 0;
        scores.push(lcpScore);
      }
      
      // Use INP if available, otherwise FID
      const interactivityMetric = updated.INP || updated.FID;
      if (interactivityMetric) {
        const score = interactivityMetric.rating === 'good' ? 100 : interactivityMetric.rating === 'needs-improvement' ? 50 : 0;
        scores.push(score);
      }
      
      if (updated.CLS) {
        const clsScore = updated.CLS.rating === 'good' ? 100 : updated.CLS.rating === 'needs-improvement' ? 50 : 0;
        scores.push(clsScore);
      }
      
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        updated.overallScore = Math.round(avg);
        updated.overallRating = avg >= 90 ? 'good' : avg >= 50 ? 'needs-improvement' : 'poor';
      }
      
      return updated;
    });

    // Report to PostHog
    try {
      posthog.capture('web_vital', {
        metric_name: metric.name,
        metric_value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        navigation_type: metric.navigationType,
        page_path: window.location.pathname,
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString(),
      });

      if (import.meta.env.DEV) {
        console.log(`[WebVitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
      }
    } catch (error) {
      console.error('[WebVitals] Error reporting metric:', error);
    }
  }, []);

  // Collect Web Vitals using PerformanceObserver
  useEffect(() => {
    const observers: PerformanceObserver[] = [];

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry) {
          reportMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            rating: getRating('LCP', lastEntry.startTime),
            delta: lastEntry.startTime,
            id: `lcp-${Date.now()}`,
            navigationType: 'navigate',
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          reportMetric({
            name: 'FID',
            value: fid,
            rating: getRating('FID', fid),
            delta: fid,
            id: `fid-${Date.now()}`,
            navigationType: 'navigate',
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            reportMetric({
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue),
              delta: entry.value,
              id: `cls-${Date.now()}`,
              navigationType: 'navigate',
            });
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);

      // Interaction to Next Paint (INP) - New Core Web Vital
      try {
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            // INP is measured from event handlers
            const entryWithInteraction = entry as PerformanceEntry & { interactionId?: number; duration: number };
            if (entryWithInteraction.interactionId) {
              const inp = entryWithInteraction.duration;
              reportMetric({
                name: 'INP',
                value: inp,
                rating: getRating('INP', inp),
                delta: inp,
                id: `inp-${entryWithInteraction.interactionId}`,
                navigationType: 'navigate',
              });
            }
          });
        });
        
        // Use type assertion for the observe options that include durationThreshold
        inpObserver.observe({ type: 'event', buffered: true } as PerformanceObserverInit);
        observers.push(inpObserver);
      } catch (e) {
        // INP observation not supported in all browsers
        if (import.meta.env.DEV) {
          console.log('[WebVitals] INP observation not supported');
        }
      }

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
        if (fcpEntry) {
          reportMetric({
            name: 'FCP',
            value: fcpEntry.startTime,
            rating: getRating('FCP', fcpEntry.startTime),
            delta: fcpEntry.startTime,
            id: `fcp-${Date.now()}`,
            navigationType: 'navigate',
          });
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      observers.push(fcpObserver);

      // Time to First Byte (TTFB)
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const ttfb = navEntries[0].responseStart;
        reportMetric({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: ttfb,
          id: `ttfb-${Date.now()}`,
          navigationType: navEntries[0].type,
        });
      }

      setIsCollecting(false);
    } catch (error) {
      console.error('[WebVitals] Error setting up observers:', error);
      setIsCollecting(false);
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [reportMetric]);

  // Calculate performance grade
  const getPerformanceGrade = useCallback((): 'A' | 'B' | 'C' | 'D' | 'F' => {
    const score = metrics.overallScore;
    if (score === null) return 'F';
    
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, [metrics.overallScore]);

  return (
    <WebVitalsContext.Provider
      value={{
        metrics,
        isCollecting,
        reportMetric,
        getPerformanceGrade,
      }}
    >
      {children}
    </WebVitalsContext.Provider>
  );
};

export const useWebVitals = () => {
  const context = useContext(WebVitalsContext);
  if (!context) {
    throw new Error('useWebVitals must be used within WebVitalsProvider');
  }
  return context;
};

export default WebVitalsContext;
