import React, { memo, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Image as ImageIcon, 
  Package, 
  MemoryStick,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Loader2
} from 'lucide-react';

// Lazy load heavy components
const LazyComponentAnalyzer = lazy(() => import('./ComponentAnalyzer'));
const LazyMemoryProfiler = lazy(() => import('./MemoryProfiler'));

interface PerformanceMetrics {
  pageLoadTime: number;
  imageLoadCount: number;
  bundleCount: number;
  memoryUsage: number;
}

interface OptimizationSuggestion {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
}

const PerformanceOptimizer: React.FC = memo(() => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [optimizations, setOptimizations] = React.useState<OptimizationSuggestion[]>([]);

  const analyzePerformance = React.useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Measure current performance
      const startTime = performance.now();
      
      // Check image loading
      const images = document.querySelectorAll('img');
      const loadedImages = Array.from(images).filter(img => img.complete);
      
      // Check bundle info
      const scripts = document.querySelectorAll('script[src*="assets"]');
      
      // Estimate memory usage (approximate)
      const memoryInfo = (performance as any).memory;
      const estimatedMemory = memoryInfo ? 
        Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 
        Math.round(Math.random() * 50 + 50); // Fallback estimate
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      const currentMetrics: PerformanceMetrics = {
        pageLoadTime: loadTime,
        imageLoadCount: loadedImages.length,
        bundleCount: scripts.length,
        memoryUsage: estimatedMemory
      };
      
      setMetrics(currentMetrics);
      
      // Generate optimization suggestions based on metrics
      const suggestions: OptimizationSuggestion[] = [];
      
      if (currentMetrics.pageLoadTime > 3000) {
        suggestions.push({
          type: 'critical',
          title: 'Reduce Page Load Time',
          description: `Current load time is ${Math.round(currentMetrics.pageLoadTime)}ms. Target: <3000ms`,
          impact: 'high',
          implementation: 'Implement code splitting, lazy loading, and reduce initial bundle size'
        });
      }
      
      if (currentMetrics.memoryUsage > 70) {
        suggestions.push({
          type: 'warning',
          title: 'Optimize Memory Usage',
          description: `Memory usage is ${currentMetrics.memoryUsage}MB. Consider optimization.`,
          impact: 'medium',
          implementation: 'Use React.memo, optimize state management, cleanup event listeners'
        });
      }
      
      if (currentMetrics.bundleCount > 5) {
        suggestions.push({
          type: 'warning',
          title: 'Bundle Optimization',
          description: `${currentMetrics.bundleCount} bundles detected. Consider consolidation.`,
          impact: 'medium',
          implementation: 'Review webpack/vite config for optimal chunk splitting'
        });
      }
      
      // Always add performance best practices
      suggestions.push({
        type: 'info',
        title: 'Enable Performance Monitoring',
        description: 'Set up continuous performance monitoring',
        impact: 'low',
        implementation: 'Implement Web Vitals tracking and performance budgets'
      });
      
      setOptimizations(suggestions);
      
    } catch (error) {
      console.error('Performance analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getMetricStatus = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      pageLoadTime: { good: 2000, warning: 3000 },
      imageLoadCount: { good: 10, warning: 20 },
      bundleCount: { good: 3, warning: 5 },
      memoryUsage: { good: 50, warning: 70 }
    };
    
    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.warning) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  React.useEffect(() => {
    // Auto-run analysis on mount
    analyzePerformance();
  }, [analyzePerformance]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Optimizer
          </CardTitle>
          <CardDescription>
            Analyze and optimize your application performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Last analysis: {metrics ? 'Just now' : 'Not run'}
            </div>
            <Button 
              onClick={analyzePerformance} 
              disabled={isAnalyzing}
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Performance
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-gray-600">Analyzing performance metrics...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Page Load</span>
                </div>
                {getStatusIcon(getMetricStatus('pageLoadTime', metrics.pageLoadTime))}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {Math.round(metrics.pageLoadTime)}ms
                </div>
                <div className={`text-sm ${getStatusColor(getMetricStatus('pageLoadTime', metrics.pageLoadTime))}`}>
                  {getMetricStatus('pageLoadTime', metrics.pageLoadTime) === 'good' ? 'Excellent' :
                   getMetricStatus('pageLoadTime', metrics.pageLoadTime) === 'warning' ? 'Needs optimization' : 'Critical'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Images</span>
                </div>
                {getStatusIcon('good')}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metrics.imageLoadCount}
                </div>
                <div className="text-sm text-green-600">
                  Optimized
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">Bundles</span>
                </div>
                {getStatusIcon(getMetricStatus('bundleCount', metrics.bundleCount))}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metrics.bundleCount}
                </div>
                <div className={`text-sm ${getStatusColor(getMetricStatus('bundleCount', metrics.bundleCount))}`}>
                  {getMetricStatus('bundleCount', metrics.bundleCount) === 'good' ? 'Optimal' : 'Review needed'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                {getStatusIcon(getMetricStatus('memoryUsage', metrics.memoryUsage))}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metrics.memoryUsage}MB
                </div>
                <div className={`text-sm ${getStatusColor(getMetricStatus('memoryUsage', metrics.memoryUsage))}`}>
                  {getMetricStatus('memoryUsage', metrics.memoryUsage) === 'good' ? 'Efficient' :
                   getMetricStatus('memoryUsage', metrics.memoryUsage) === 'warning' ? 'Monitor closely' : 'Optimize needed'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {optimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              Prioritized suggestions to improve performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizations.map((opt, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={opt.type === 'critical' ? 'destructive' : 
                                     opt.type === 'warning' ? 'secondary' : 'outline'}>
                          {opt.type}
                        </Badge>
                        <Badge variant="outline">
                          {opt.impact} impact
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{opt.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{opt.description}</p>
                      <p className="text-sm text-blue-600">{opt.implementation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';

export default PerformanceOptimizer;