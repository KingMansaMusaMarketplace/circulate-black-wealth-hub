import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Leaf, Car, Store, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNoireRideImpact } from '@/hooks/useNoireRideImpact';

const NoireImpactDashboard: React.FC = () => {
  const { impact, loading } = useNoireRideImpact();

  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };

  const stats = [
    { icon: Car, label: 'Total Rides', value: impact.total_rides, color: 'text-mansagold', bg: 'bg-mansagold/10' },
    { icon: DollarSign, label: 'Fare Invested', value: formatCurrency(impact.total_fare_spent), color: 'text-emerald-400', bg: 'bg-emerald-400/10', formatted: true },
    { icon: Users, label: 'Driver Earnings', value: formatCurrency(impact.driver_earnings_supported), color: 'text-blue-400', bg: 'bg-blue-400/10', formatted: true },
    { icon: Store, label: 'Businesses Visited', value: impact.community_businesses_visited, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: Leaf, label: 'CO₂ Saved', value: `${impact.co2_saved_kg.toFixed(1)} kg`, color: 'text-green-400', bg: 'bg-green-400/10', formatted: true },
    { icon: TrendingUp, label: 'Credits Earned', value: impact.community_credits_earned.toFixed(0), color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const driverKeepPercentage = impact.total_fare_spent > 0
    ? ((impact.driver_earnings_supported / impact.total_fare_spent) * 100).toFixed(0)
    : '80';

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      {/* Header with impact summary */}
      <div className="bg-gradient-to-r from-mansagold/15 via-emerald-500/10 to-blue-500/10 border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            <h3 className="text-white font-bold text-lg">Your Ride Impact</h3>
          </div>
          <Button size="sm" variant="outline" className="border-white/10 text-white/50 hover:bg-white/5 text-xs gap-1">
            <Share2 className="h-3 w-3" />
            Share
          </Button>
        </div>
        <p className="text-white/50 text-xs">
          See exactly how your Noire rides strengthen the community economy
        </p>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Wealth Circulation Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center"
        >
          <p className="text-white/50 text-xs mb-1">Of every fare you pay, your driver keeps</p>
          <div className="text-5xl font-bold text-emerald-400 font-mono">{driverKeepPercentage}%</div>
          <p className="text-emerald-400/60 text-xs mt-1">
            That's {formatCurrency(impact.driver_earnings_supported)} directly to community drivers
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 rounded-lg p-3 text-center"
            >
              <div className={`inline-flex p-1.5 rounded-full ${stat.bg} mb-1.5`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
              <p className="text-white font-bold text-sm font-mono">
                {stat.formatted ? stat.value : (stat.value as number).toLocaleString()}
              </p>
              <p className="text-white/40 text-[10px] leading-tight mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Community Flow Visualization */}
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-white/60 text-xs uppercase tracking-wider mb-3">Where Your Money Goes</h4>
          <div className="space-y-2">
            {[
              { label: 'Driver earnings (80%)', pct: 80, color: 'bg-emerald-400' },
              { label: 'Platform operations (15%)', pct: 15, color: 'bg-mansagold' },
              { label: 'Community fund (5%)', pct: 5, color: 'bg-blue-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white/40 font-mono">{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoireImpactDashboard;
