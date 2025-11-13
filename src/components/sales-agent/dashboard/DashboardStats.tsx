import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

interface DashboardStatsProps {
  totalReferrals: number;
  totalEarned: number;
  pendingCommissions: number;
  recruitedAgents: number;
  tier: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalReferrals,
  totalEarned,
  pendingCommissions,
  recruitedAgents,
  tier
}) => {
  const tierColors = {
    bronze: 'text-orange-600 dark:text-orange-400',
    silver: 'text-slate-400 dark:text-slate-300',
    gold: 'text-yellow-500 dark:text-yellow-400',
    platinum: 'text-purple-600 dark:text-purple-400'
  };

  const tierColor = tierColors[tier.toLowerCase() as keyof typeof tierColors] || tierColors.bronze;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="glass-card hover-lift border-border/50 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">
            Current Tier
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-primary/60 transition-transform group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-display font-bold ${tierColor} capitalize`}>
            {tier}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            {totalReferrals} lifetime referrals
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift border-border/50 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">
            Total Earned
          </CardTitle>
          <DollarSign className="h-5 w-5 text-primary/60 transition-transform group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-display font-bold text-green-600 dark:text-green-400">
            ${totalEarned.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            All-time earnings
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift border-border/50 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">
            Pending
          </CardTitle>
          <Clock className="h-5 w-5 text-primary/60 transition-transform group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-display font-bold text-orange-600 dark:text-orange-400">
            ${pendingCommissions.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            Awaiting payment
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift border-border/50 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">
            Team Size
          </CardTitle>
          <Users className="h-5 w-5 text-primary/60 transition-transform group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-display font-bold text-blue-600 dark:text-blue-400">
            {recruitedAgents}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            Recruited agents
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;