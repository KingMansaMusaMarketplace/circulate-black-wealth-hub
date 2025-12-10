import { Card, CardContent } from '@/components/ui/card';
import { Coins, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoalitionPointsCardProps {
  points: number;
  lifetimePoints: number;
  tier: string;
  tierInfo: {
    name: string;
    multiplier: number;
    color: string;
  };
}

export function CoalitionPointsCard({ 
  points, 
  lifetimePoints, 
  tier,
  tierInfo 
}: CoalitionPointsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <CardContent className="relative pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Available Points</span>
          </div>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            tier === 'bronze' && "bg-amber-100 text-amber-800",
            tier === 'silver' && "bg-slate-100 text-slate-800",
            tier === 'gold' && "bg-yellow-100 text-yellow-800",
            tier === 'platinum' && "bg-purple-100 text-purple-800",
          )}>
            {tierInfo.name}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-4xl font-bold tracking-tight">
            {points.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Coalition Points
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{lifetimePoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Lifetime Earned</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-sm font-medium">{tierInfo.multiplier}x</p>
            <p className="text-xs text-muted-foreground">Earning Rate</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Earn points at any participating Black-owned business and redeem anywhere in the coalition!
        </p>
      </CardContent>
    </Card>
  );
}
