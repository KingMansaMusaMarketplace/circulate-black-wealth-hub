/**
 * LazyMapboxMap - Wrapper for lazy-loading Mapbox GL
 * Defers the heavy mapbox-gl library (~200KB) until the map is actually rendered.
 * 
 * Components that use mapbox-gl directly should be lazy-loaded at the route level.
 * This wrapper provides a Suspense boundary with a loading skeleton.
 */

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

const MapSkeleton = ({ height = 400 }: { height?: number }) => (
  <div 
    className="w-full flex flex-col items-center justify-center bg-muted/50 rounded-lg" 
    style={{ height }}
  >
    <MapPin className="h-8 w-8 text-muted-foreground mb-2 animate-pulse" />
    <span className="text-sm text-muted-foreground">Loading map...</span>
  </div>
);

/**
 * Wrap any mapbox-using component in this to provide a loading state.
 * The actual mapbox-gl import stays in the child component — the key optimization
 * is that the child component itself is React.lazy() loaded at the route level,
 * so mapbox-gl only loads when that route is visited.
 */
export const LazyMapContainer: React.FC<{
  children: React.ReactNode;
  height?: number;
  className?: string;
}> = ({ children, height = 400, className }) => (
  <Suspense fallback={<MapSkeleton height={height} />}>
    <div className={className}>{children}</div>
  </Suspense>
);

export { MapSkeleton };
export default LazyMapContainer;
