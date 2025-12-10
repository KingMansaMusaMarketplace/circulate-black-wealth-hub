import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Coins, ArrowRightLeft } from 'lucide-react';
import { CoalitionStats } from '@/hooks/use-coalition';

interface CoalitionStatsCardProps {
  stats: CoalitionStats;
}

export function CoalitionStatsCard({ stats }: CoalitionStatsCardProps) {
  const statItems = [
    {
      icon: Building2,
      label: 'Businesses',
      value: stats.total_members,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      label: 'Members',
      value: stats.total_customers,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Coins,
      label: 'Points Circulated',
      value: stats.total_points_circulated,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: ArrowRightLeft,
      label: 'Points Redeemed',
      value: stats.total_points_redeemed,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className={`inline-flex p-3 rounded-full ${item.bgColor} mb-2`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tier Distribution */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium mb-3">Member Tier Distribution</p>
          <div className="flex gap-2">
            <div className="flex-1 text-center p-2 rounded-lg bg-amber-500/10">
              <p className="text-lg font-bold text-amber-600">{stats.bronze_members}</p>
              <p className="text-xs text-muted-foreground">Bronze</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-slate-500/10">
              <p className="text-lg font-bold text-slate-600">{stats.silver_members}</p>
              <p className="text-xs text-muted-foreground">Silver</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-yellow-500/10">
              <p className="text-lg font-bold text-yellow-600">{stats.gold_members}</p>
              <p className="text-xs text-muted-foreground">Gold</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-purple-500/10">
              <p className="text-lg font-bold text-purple-600">{stats.platinum_members}</p>
              <p className="text-xs text-muted-foreground">Platinum</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
