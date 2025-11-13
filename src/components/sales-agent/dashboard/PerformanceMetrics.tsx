import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendValue,
  icon 
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500 dark:text-green-400';
      case 'down':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="glass-card hover-lift border-border/50 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-body font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="transition-transform group-hover:scale-110">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display font-bold text-foreground">{value}</div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs mt-1 font-body ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface PerformanceMetricsProps {
  referrals: any[];
  commissions: any[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  referrals, 
  commissions 
}) => {
  // Calculate metrics
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    // Current month referrals
    const currentMonthReferrals = referrals.filter(r => 
      new Date(r.referral_date).getMonth() === currentMonth
    ).length;
    
    // Last month referrals
    const lastMonthReferrals = referrals.filter(r => 
      new Date(r.referral_date).getMonth() === lastMonth
    ).length;
    
    // Calculate conversion rate (paid commissions / total referrals)
    const paidCommissions = commissions.filter(c => c.status === 'paid').length;
    const conversionRate = referrals.length > 0 
      ? ((paidCommissions / referrals.length) * 100).toFixed(1)
      : '0.0';
    
    // Average deal size
    const totalEarnings = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
    const avgDealSize = paidCommissions > 0 
      ? (totalEarnings / paidCommissions).toFixed(2)
      : '0.00';
    
    // Pending earnings
    const pendingEarnings = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
    
    // Calculate trends
    const referralTrend = lastMonthReferrals === 0 
      ? 'neutral' 
      : currentMonthReferrals > lastMonthReferrals 
        ? 'up' 
        : currentMonthReferrals < lastMonthReferrals 
          ? 'down' 
          : 'neutral';
    
    const referralChange = lastMonthReferrals > 0
      ? `${Math.abs(((currentMonthReferrals - lastMonthReferrals) / lastMonthReferrals) * 100).toFixed(0)}%`
      : currentMonthReferrals > 0 ? '100%' : '0%';

    return {
      currentMonthReferrals,
      conversionRate,
      avgDealSize,
      pendingEarnings,
      referralTrend,
      referralChange
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="This Month's Referrals"
        value={metrics.currentMonthReferrals}
        trend={metrics.referralTrend as 'up' | 'down' | 'neutral'}
        trendValue={metrics.referralChange}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
      />
      <MetricCard
        title="Average Commission"
        value={`$${metrics.avgDealSize}`}
      />
      <MetricCard
        title="Pending Earnings"
        value={`$${metrics.pendingEarnings.toFixed(2)}`}
      />
    </div>
  );
};

export default PerformanceMetrics;