import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpactMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  format?: 'number' | 'currency';
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
    },
    {
      label: 'Total Transactions',
      value: totalTransactions,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Completed marketplace transactions',
      format: 'number',
    },
    {
      label: 'Community Reach',
      value: communityReach,
      icon: <Users className="h-5 w-5" />,
      description: 'Estimated people impacted',
      format: 'number',
    },
    {
      label: 'Economic Impact',
      value: economicImpact,
      icon: <DollarSign className="h-5 w-5" />,
      description: 'With 2.3x multiplier effect',
      format: 'currency',
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Impact Dashboard</CardTitle>
        <CardDescription>
          Real-time metrics showing the economic impact of your corporate sponsorship
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card"
            >
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                {metric.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {formatValue(metric.value, metric.format)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
