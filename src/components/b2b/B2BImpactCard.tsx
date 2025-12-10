import { Card, CardContent } from '@/components/ui/card';
import { Building2, Handshake, DollarSign, TrendingUp, Target, Users } from 'lucide-react';
import { B2BImpactMetrics } from '@/hooks/use-b2b';

interface B2BImpactCardProps {
  metrics: B2BImpactMetrics;
}

export function B2BImpactCard({ metrics }: B2BImpactCardProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const stats = [
    {
      icon: Building2,
      label: 'Active Suppliers',
      value: metrics.active_suppliers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Target,
      label: 'Open Needs',
      value: metrics.open_needs,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Handshake,
      label: 'Connections Made',
      value: metrics.total_connections,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      label: 'Money in Community',
      value: formatCurrency(metrics.money_kept_in_community),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      isFormatted: true,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h3 className="font-semibold">Community Economic Impact</h3>
        </div>
        <p className="text-sm text-primary-foreground/80 mt-1">
          When Black-owned businesses buy from each other, money circulates 6x longer in our community
        </p>
      </div>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex p-2 rounded-full ${stat.bgColor} mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold">
                {stat.isFormatted ? stat.value : (stat.value as number).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
