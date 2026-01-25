import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Check, Lock, Sparkles } from 'lucide-react';

interface Milestone {
  id: string;
  milestone_name: string;
  referrals_required: number;
  bonus_amount: number;
  is_active: boolean;
}

interface PartnerBonusMilestonesProps {
  milestones: Milestone[];
  currentReferrals: number;
  earnedBonuses: number;
}

const PartnerBonusMilestones: React.FC<PartnerBonusMilestonesProps> = ({
  milestones,
  currentReferrals,
  earnedBonuses,
}) => {
  // Sort by referrals required
  const sortedMilestones = [...milestones].sort((a, b) => a.referrals_required - b.referrals_required);

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-400" />
            Bonus Milestones
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            ${earnedBonuses.toFixed(2)} earned
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedMilestones.map((milestone) => {
            const isAchieved = currentReferrals >= milestone.referrals_required;
            const progress = Math.min((currentReferrals / milestone.referrals_required) * 100, 100);
            const remaining = Math.max(milestone.referrals_required - currentReferrals, 0);
            
            return (
              <div 
                key={milestone.id}
                className={`relative p-4 rounded-lg border transition-all ${
                  isAchieved 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-slate-900/40 border-slate-700/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isAchieved ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      {isAchieved ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium ${isAchieved ? 'text-emerald-400' : 'text-white'}`}>
                        {milestone.milestone_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isAchieved 
                          ? '✓ Achieved!' 
                          : `${remaining} more referrals needed`
                        }
                      </div>
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${isAchieved ? 'text-emerald-400' : 'text-slate-400'}`}>
                    +${milestone.bonus_amount}
                  </div>
                </div>
                
                {/* Progress bar for unachieved */}
                {!isAchieved && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                      <span>{currentReferrals} referrals</span>
                      <span>{milestone.referrals_required} required</span>
                    </div>
                  </div>
                )}
                
                {/* Celebration effect for achieved */}
                {isAchieved && (
                  <Sparkles className="absolute top-2 right-2 h-4 w-4 text-emerald-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerBonusMilestones;
