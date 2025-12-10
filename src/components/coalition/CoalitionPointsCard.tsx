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
    <Card className="relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45,93%,47%)]/10 via-transparent to-[hsl(222,84%,45%)]/10" />
      <CardContent className="relative pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[hsl(45,93%,47%)]/20 rounded-full">
              <Coins className="h-5 w-5 text-[hsl(45,93%,58%)]" />
            </div>
            <span className="text-sm font-medium text-white/70">Available Points</span>
          </div>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            tier === 'bronze' && "bg-amber-500/20 text-amber-400 border border-amber-500/30",
            tier === 'silver' && "bg-slate-400/20 text-slate-300 border border-slate-400/30",
            tier === 'gold' && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
            tier === 'platinum' && "bg-purple-500/20 text-purple-400 border border-purple-500/30",
          )}>
            {tierInfo.name}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-4xl font-bold tracking-tight text-white">
            {points.toLocaleString()}
          </p>
          <p className="text-sm text-white/70">
            Coalition Points
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">{lifetimePoints.toLocaleString()}</p>
              <p className="text-xs text-white/60">Lifetime Earned</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-sm font-medium text-white">{tierInfo.multiplier}x</p>
            <p className="text-xs text-white/60">Earning Rate</p>
          </div>
        </div>

        <p className="text-xs text-white/60">
          Earn points at any participating Black-owned business and redeem anywhere in the coalition!
        </p>
      </CardContent>
    </Card>
  );
}
