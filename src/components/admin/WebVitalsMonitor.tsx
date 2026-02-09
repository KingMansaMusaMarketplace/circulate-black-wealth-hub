/**
 * Web Vitals Monitor
 * Admin dashboard widget for monitoring Core Web Vitals
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  MousePointer, 
  Layout, 
  Clock, 
  Server,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useWebVitals, WebVitalMetric } from '@/contexts/WebVitalsContext';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: WebVitalMetric | null;
  label: string;
  description: string;
  icon: React.ReactNode;
  unit: string;
  thresholds: { good: number; needsImprovement: number };
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  label,
  description,
  icon,
  unit,
  thresholds,
}) => {
  const getValue = () => {
    if (!metric) return '—';
    if (label === 'CLS') {
      return metric.value.toFixed(3);
    }
    return `${Math.round(metric.value)}${unit}`;
  };

  const getRatingColor = (rating: string | undefined) => {
    switch (rating) {
      case 'good':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'needs-improvement':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'poor':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getProgressValue = () => {
    if (!metric) return 0;
    // Invert for metrics where lower is better
    const maxBad = thresholds.needsImprovement * 1.5;
    const percentage = Math.max(0, Math.min(100, (1 - metric.value / maxBad) * 100));
    return percentage;
  };

  const getTrendIcon = () => {
    if (!metric) return <Minus className="h-3 w-3 text-slate-400" />;
    if (metric.rating === 'good') return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (metric.rating === 'poor') return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-yellow-400" />;
  };

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/10">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{label}</h4>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <Badge 
            variant="outline" 
            className={cn('text-xs', getRatingColor(metric?.rating))}
          >
            {metric?.rating || 'pending'}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-white">{getValue()}</span>
          <span className="text-xs text-slate-400">
            Good: &lt;{thresholds.good}{unit}
          </span>
        </div>
        <Progress 
          value={getProgressValue()} 
          className="h-1.5"
        />
      </div>
    </div>
  );
};

export const WebVitalsMonitor: React.FC = () => {
  const { metrics, isCollecting, getPerformanceGrade } = useWebVitals();

  const grade = getPerformanceGrade();
  const gradeColors = {
    A: 'text-green-400 bg-green-500/20 border-green-500/30',
    B: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    C: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    D: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    F: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Core Web Vitals</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time performance metrics
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isCollecting && (
              <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 animate-pulse">
                Collecting...
              </Badge>
            )}
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center border-2 font-bold text-xl',
              gradeColors[grade]
            )}>
              {grade}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Score */}
        {metrics.overallScore !== null && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Overall Performance</span>
              <span className={cn(
                'text-lg font-bold',
                metrics.overallRating === 'good' ? 'text-green-400' :
                metrics.overallRating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'
              )}>
                {metrics.overallScore}%
              </span>
            </div>
            <Progress value={metrics.overallScore} className="h-2" />
          </div>
        )}

        {/* Core Web Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            metric={metrics.LCP}
            label="LCP"
            description="Largest Contentful Paint"
            icon={<Layout className="h-4 w-4 text-purple-400" />}
            unit="ms"
            thresholds={{ good: 2500, needsImprovement: 4000 }}
          />
          
          <MetricCard
            metric={metrics.INP || metrics.FID}
            label={metrics.INP ? 'INP' : 'FID'}
            description={metrics.INP ? 'Interaction to Next Paint' : 'First Input Delay'}
            icon={<MousePointer className="h-4 w-4 text-blue-400" />}
            unit="ms"
            thresholds={metrics.INP 
              ? { good: 200, needsImprovement: 500 }
              : { good: 100, needsImprovement: 300 }
            }
          />
          
          <MetricCard
            metric={metrics.CLS}
            label="CLS"
            description="Cumulative Layout Shift"
            icon={<Zap className="h-4 w-4 text-yellow-400" />}
            unit=""
            thresholds={{ good: 0.1, needsImprovement: 0.25 }}
          />
          
          <MetricCard
            metric={metrics.FCP}
            label="FCP"
            description="First Contentful Paint"
            icon={<Clock className="h-4 w-4 text-green-400" />}
            unit="ms"
            thresholds={{ good: 1800, needsImprovement: 3000 }}
          />
          
          <MetricCard
            metric={metrics.TTFB}
            label="TTFB"
            description="Time to First Byte"
            icon={<Server className="h-4 w-4 text-orange-400" />}
            unit="ms"
            thresholds={{ good: 800, needsImprovement: 1800 }}
          />
        </div>

        {/* Recommendations */}
        {metrics.overallRating && metrics.overallRating !== 'good' && (
          <div className="backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Improvement Suggestions</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              {metrics.LCP?.rating !== 'good' && (
                <li>• Optimize largest content element (images, fonts, text blocks)</li>
              )}
              {(metrics.INP?.rating !== 'good' || metrics.FID?.rating !== 'good') && (
                <li>• Reduce JavaScript execution time and break up long tasks</li>
              )}
              {metrics.CLS?.rating !== 'good' && (
                <li>• Reserve space for dynamic content and avoid layout shifts</li>
              )}
              {metrics.TTFB?.rating !== 'good' && (
                <li>• Optimize server response time and use CDN caching</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebVitalsMonitor;
