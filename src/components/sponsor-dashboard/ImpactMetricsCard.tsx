import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building2, DollarSign, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpactMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  format?: 'number' | 'currency';
  gradient: string;
}

interface ImpactMetricsCardProps {
  businessesSupported: number;
  totalTransactions: number;
  communityReach: number;
  economicImpact: number;
  className?: string;
}

export const ImpactMetricsCard: React.FC<ImpactMetricsCardProps> = ({
  businessesSupported,
  totalTransactions,
  communityReach,
  economicImpact,
  className,
}) => {
  const metrics: ImpactMetric[] = [
    {
      label: 'Businesses Supported',
      value: businessesSupported,
      icon: <Building2 className="h-5 w-5" />,
      description: 'Unique Black-owned businesses',
      format: 'number',
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      label: 'Total Transactions',
      value: totalTransactions,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Completed marketplace transactions',
      format: 'number',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Community Reach',
      value: communityReach,
      icon: <Users className="h-5 w-5" />,
      description: 'Estimated people impacted',
      format: 'number',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Economic Impact',
      value: economicImpact,
      icon: <DollarSign className="h-5 w-5" />,
      description: 'With 2.3x multiplier effect',
      format: 'currency',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const formatValue = (value: number, format?: 'number' | 'currency') => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
      <CardHeader>
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Your Impact Dashboard
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Real-time metrics showing the economic impact of your corporate sponsorship
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="relative flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/10 transition-colors"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${metric.gradient} opacity-10 rounded-full blur-2xl`} />
              </div>
              <div className={`relative rounded-xl bg-gradient-to-br ${metric.gradient} p-3 text-white shadow-lg`}>
                {metric.icon}
              </div>
              <div className="flex-1 relative">
                <p className="text-sm text-blue-200/70">{metric.label}</p>
                <p className="text-2xl font-bold mt-1 text-white">
                  {formatValue(metric.value, metric.format)}
                </p>
                <p className="text-xs text-blue-200/50 mt-1">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};