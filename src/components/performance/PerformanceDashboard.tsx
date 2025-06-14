
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Zap, Clock, Eye, MousePointer } from 'lucide-react';

const PerformanceDashboard: React.FC = () => {
  const { metrics, isLoading, performanceGrade } = usePerformanceMonitoring();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const getScoreColor = (score: number, thresholds: [number, number]) => {
    if (score <= thresholds[0]) return 'text-green-600';
    if (score <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Core Web Vitals and loading performance</CardDescription>
          </div>
          <Badge className={getGradeColor(performanceGrade)}>
            Grade: {performanceGrade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">First Contentful Paint</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.firstContentfulPaint, [1800, 3000])}`}>
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.min(100, (4200 - metrics.firstContentfulPaint) / 42)} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Largest Contentful Paint</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.largestContentfulPaint, [2500, 4000])}`}>
              {metrics.largestContentfulPaint.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.min(100, (5500 - metrics.largestContentfulPaint) / 55)} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              <span className="text-sm font-medium">First Input Delay</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.firstInputDelay, [100, 300])}`}>
              {metrics.firstInputDelay.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.min(100, (500 - metrics.firstInputDelay) / 5)} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Cumulative Layout Shift</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.cumulativeLayoutShift * 1000, [100, 250])}`}>
              {metrics.cumulativeLayoutShift.toFixed(3)}
            </div>
            <Progress 
              value={Math.min(100, (0.4 - metrics.cumulativeLayoutShift) * 250)} 
              className="h-2"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Performance Tips</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Green scores indicate excellent performance</p>
            <p>• Yellow scores suggest room for improvement</p>
            <p>• Red scores indicate performance issues that need attention</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;
