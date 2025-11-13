import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Gift } from 'lucide-react';

interface EarningsBreakdownProps {
  directCommissions: number;
  teamOverrides: number;
  recruitmentBonuses: number;
  totalEarnings: number;
}

const EarningsBreakdown: React.FC<EarningsBreakdownProps> = ({
  directCommissions,
  teamOverrides,
  recruitmentBonuses,
  totalEarnings
}) => {
  const calculatePercentage = (amount: number) => {
    return totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
  };

  const earnings = [
    {
      label: 'Direct Commissions',
      amount: directCommissions,
      percentage: calculatePercentage(directCommissions),
      icon: DollarSign,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Team Overrides',
      amount: teamOverrides,
      percentage: calculatePercentage(teamOverrides),
      icon: Users,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Recruitment Bonuses',
      amount: recruitmentBonuses,
      percentage: calculatePercentage(recruitmentBonuses),
      icon: Gift,
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-display font-semibold text-foreground">
          Earnings Breakdown
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          Your income by source
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline gap-2">
          <TrendingUp className="h-6 w-6 text-green-500 dark:text-green-400" />
          <span className="text-4xl font-display font-bold text-foreground">
            ${totalEarnings.toFixed(2)}
          </span>
          <span className="text-muted-foreground font-body">total</span>
        </div>

        <div className="space-y-4">
          {earnings.map((earning) => {
            const Icon = earning.icon;
            return (
              <div key={earning.label} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${earning.bgColor} transition-transform group-hover:scale-110`}>
                      <Icon className={`h-4 w-4 ${earning.color}`} />
                    </div>
                    <span className="text-sm font-body font-medium text-foreground">
                      {earning.label}
                    </span>
                  </div>
                  <span className="font-display font-bold text-foreground">
                    ${earning.amount.toFixed(2)}
                  </span>
                </div>
                <Progress value={earning.percentage} className="h-2 bg-muted/30" />
                <div className="text-xs text-muted-foreground mt-1 font-body">
                  {earning.percentage.toFixed(1)}% of total earnings
                </div>
              </div>
            );
          })}
        </div>

        {totalEarnings === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm font-body">No earnings yet. Start referring businesses!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsBreakdown;