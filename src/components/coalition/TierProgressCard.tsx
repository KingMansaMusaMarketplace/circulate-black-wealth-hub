import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Crown, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TierProgressCardProps {
  currentTier: string;
  progress: number;
  pointsNeeded: number;
  tierInfo: {
    name: string;
    multiplier: number;
    color: string;
  };
}

const tierIcons = {
  bronze: Trophy,
  silver: Star,
  gold: Crown,
  platinum: Gem,
};

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const nextTierNames: Record<string, string> = {
  bronze: 'Silver',
  silver: 'Gold',
  gold: 'Platinum',
  platinum: 'Max Tier',
};

export function TierProgressCard({ 
  currentTier, 
  progress, 
  pointsNeeded,
  tierInfo 
}: TierProgressCardProps) {
  const Icon = tierIcons[currentTier as keyof typeof tierIcons] || Trophy;
  const gradientClass = tierColors[currentTier as keyof typeof tierColors] || tierColors.bronze;
  const nextTier = nextTierNames[currentTier] || 'Max Tier';

  return (
    <Card className="overflow-hidden">
      <div className={cn("bg-gradient-to-r p-4", gradientClass)}>
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-full">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{tierInfo.name} Member</h3>
            <p className="text-white/80 text-sm">{tierInfo.multiplier}x Points Multiplier</p>
          </div>
        </div>
      </div>
      <CardContent className="pt-4 space-y-4">
        {currentTier !== 'platinum' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextTier}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Earn <span className="font-semibold text-foreground">{pointsNeeded.toLocaleString()}</span> more points to reach {nextTier}
            </p>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm font-medium text-primary">
              🎉 You've reached the highest tier!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Enjoy 2x points on all purchases
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Your Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {tierInfo.multiplier}x points on all purchases</li>
            {currentTier === 'silver' && <li>• Early access to new rewards</li>}
            {currentTier === 'gold' && (
              <>
                <li>• Early access to new rewards</li>
                <li>• Exclusive Gold-only deals</li>
              </>
            )}
            {currentTier === 'platinum' && (
              <>
                <li>• Early access to new rewards</li>
                <li>• Exclusive Platinum-only deals</li>
                <li>• Priority customer support</li>
                <li>• VIP event invitations</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
