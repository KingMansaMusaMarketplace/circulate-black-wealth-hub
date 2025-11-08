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
    bronze: 'text-amber-600',
    silver: 'text-gray-400',
    gold: 'text-yellow-500',
    platinum: 'text-purple-600'
  };

  const tierColor = tierColors[tier.toLowerCase() as keyof typeof tierColors] || tierColors.bronze;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${tierColor} capitalize`}>
            {tier}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalReferrals} lifetime referrals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalEarned.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All-time earnings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            ${pendingCommissions.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Awaiting payment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {recruitedAgents}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recruited agents
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
