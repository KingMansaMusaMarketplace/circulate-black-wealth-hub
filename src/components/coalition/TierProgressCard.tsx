import { Card, CardContent } from '@/components/ui/card';
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

const tierGradients = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-[hsl(45,93%,47%)] to-[hsl(38,93%,42%)]',
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
  const gradientClass = tierGradients[currentTier as keyof typeof tierGradients] || tierGradients.bronze;
  const nextTier = nextTierNames[currentTier] || 'Max Tier';

  return (
    <Card className="overflow-hidden bg-white/10 backdrop-blur-xl border-white/20">
      <div className={cn("bg-gradient-to-r p-4", gradientClass)}>
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
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
                <span className="text-white/70">Progress to {nextTier}</span>
                <span className="font-medium text-white">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" />
            </div>
            <p className="text-sm text-white/70">
              Earn <span className="font-semibold text-[hsl(45,93%,58%)]">{pointsNeeded.toLocaleString()}</span> more points to reach {nextTier}
            </p>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm font-medium text-[hsl(45,93%,58%)]">
              🎉 You've reached the highest tier!
            </p>
            <p className="text-xs text-white/60 mt-1">
              Enjoy 2x points on all purchases
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium mb-2 text-white">Your Benefits</h4>
          <ul className="text-sm text-white/70 space-y-1">
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
