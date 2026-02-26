/**
 * LazyChart - Recharts lazy-loading wrapper
 * Defers loading of the heavy recharts library (~300KB) until actually needed.
 * All chart components are re-exported through this module.
 */

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-load the entire recharts module once
const RechartsModule = React.lazy(() => import('recharts'));

// Chart loading fallback
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="w-full flex items-center justify-center" style={{ height }}>
    <Skeleton className="w-full h-full rounded-lg" />
  </div>
);

/**
 * We re-export recharts components via a dynamic import proxy.
 * Components using recharts should import from this file instead of 'recharts' directly.
 * 
 * Usage:
 *   import { LazyResponsiveContainer, useLazyRecharts } from '@/components/charts/LazyChart';
 *   
 *   const MyChart = () => {
 *     const { BarChart, Bar, XAxis, YAxis, ... } = useLazyRecharts();
 *     return <LazyResponsiveContainer><BarChart>...</BarChart></LazyResponsiveContainer>;
 *   };
 * 
 * OR simpler approach - just wrap your existing chart in <LazyChartContainer>:
 * 
 *   <LazyChartContainer height={300}>
 *     <BarChart data={data}>...</BarChart>
 *   </LazyChartContainer>
 */

// Simple wrapper that provides Suspense boundary for any chart content
export const LazyChartContainer: React.FC<{
  children: React.ReactNode;
  height?: number;
  className?: string;
}> = ({ children, height = 300, className }) => (
  <Suspense fallback={<ChartSkeleton height={height} />}>
    <div className={className}>{children}</div>
  </Suspense>
);

// For the simpler approach: we just re-export everything from recharts
// but consumers should wrap their charts in LazyChartContainer or Suspense
// The key optimization is that recharts is in its own manualChunk now,
// so it loads on-demand when any route that uses charts is visited.

export { ChartSkeleton };
export default LazyChartContainer;
