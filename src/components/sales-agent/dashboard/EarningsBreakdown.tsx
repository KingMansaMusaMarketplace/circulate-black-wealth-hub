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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Team Overrides',
      amount: teamOverrides,
      percentage: calculatePercentage(teamOverrides),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Recruitment Bonuses',
      amount: recruitmentBonuses,
      percentage: calculatePercentage(recruitmentBonuses),
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Breakdown</CardTitle>
        <CardDescription>Your income by source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-3xl font-bold">${totalEarnings.toFixed(2)}</span>
          <span className="text-muted-foreground">total</span>
        </div>

        <div className="space-y-4">
          {earnings.map((earning) => {
            const Icon = earning.icon;
            return (
              <div key={earning.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${earning.bgColor}`}>
                      <Icon className={`h-4 w-4 ${earning.color}`} />
                    </div>
                    <span className="text-sm font-medium">{earning.label}</span>
                  </div>
                  <span className="font-bold">${earning.amount.toFixed(2)}</span>
                </div>
                <Progress value={earning.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {earning.percentage.toFixed(1)}% of total earnings
                </div>
              </div>
            );
          })}
        </div>

        {totalEarnings === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No earnings yet. Start referring businesses!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsBreakdown;
