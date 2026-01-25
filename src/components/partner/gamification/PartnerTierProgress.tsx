import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, ArrowUp, Sparkles, Gift } from 'lucide-react';

interface TierInfo {
  name: string;
  color: string;
  minReferrals: number;
  flatFee: number;
  revShare: number;
}

const TIERS: TierInfo[] = [
  { name: 'Bronze', color: 'bg-amber-700', minReferrals: 0, flatFee: 5, revShare: 10 },
  { name: 'Silver', color: 'bg-slate-400', minReferrals: 20, flatFee: 6, revShare: 12 },
  { name: 'Gold', color: 'bg-yellow-500', minReferrals: 50, flatFee: 8, revShare: 15 },
  { name: 'Platinum', color: 'bg-purple-500', minReferrals: 100, flatFee: 10, revShare: 20 },
];

interface PartnerTierProgressProps {
  currentTier: string;
  lifetimeReferrals: number;
  currentFlatFee: number;
  currentRevShare: number;
}

const PartnerTierProgress: React.FC<PartnerTierProgressProps> = ({
  currentTier,
  lifetimeReferrals,
  currentFlatFee,
  currentRevShare,
}) => {
  const currentTierIndex = TIERS.findIndex(t => t.name.toLowerCase() === currentTier.toLowerCase());
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  
  // Calculate progress to next tier
  const currentTierMin = TIERS[currentTierIndex]?.minReferrals || 0;
  const nextTierMin = nextTier?.minReferrals || lifetimeReferrals;
  const progressRange = nextTierMin - currentTierMin;
  const currentProgress = lifetimeReferrals - currentTierMin;
  const progressPercent = progressRange > 0 ? Math.min((currentProgress / progressRange) * 100, 100) : 100;
  const referralsToNext = nextTier ? nextTierMin - lifetimeReferrals : 0;

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          Commission Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Tier Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${TIERS[currentTierIndex]?.color || 'bg-amber-700'}`}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <Badge className={`${TIERS[currentTierIndex]?.color || 'bg-amber-700'} text-white mb-1`}>
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Partner
              </Badge>
              <p className="text-xs text-slate-400">{lifetimeReferrals} lifetime referrals</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">${currentFlatFee}</div>
            <div className="text-xs text-slate-400">per signup + {currentRevShare}% rev</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress to {nextTier.name}</span>
              <span className="text-white font-medium">{referralsToNext} more referrals</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            
            {/* Next Tier Benefits */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
              <ArrowUp className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div className="text-sm">
                <span className="text-slate-400">Unlock: </span>
                <span className="text-emerald-400 font-medium">
                  ${nextTier.flatFee}/signup + {nextTier.revShare}% revenue share
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <Gift className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-medium">
              🎉 You've reached the highest tier! Maximum rewards unlocked.
            </span>
          </div>
        )}

        {/* All Tiers Overview */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700/50">
          {TIERS.map((tier, idx) => {
            const isCurrentTier = tier.name.toLowerCase() === currentTier.toLowerCase();
            const isAchieved = idx <= currentTierIndex;
            return (
              <div 
                key={tier.name}
                className={`text-center p-2 rounded-lg transition-colors ${
                  isCurrentTier 
                    ? 'bg-slate-700/50 ring-2 ring-amber-500/50' 
                    : isAchieved 
                      ? 'bg-slate-800/50' 
                      : 'bg-slate-900/30 opacity-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${tier.color}`} />
                <div className="text-xs font-medium text-slate-300">{tier.name}</div>
                <div className="text-xs text-slate-500">{tier.minReferrals}+</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerTierProgress;
