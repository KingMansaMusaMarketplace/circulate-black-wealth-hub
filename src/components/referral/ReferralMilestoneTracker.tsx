import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, TrendingUp, Users, Megaphone, Award, Trophy, Crown, Zap, 
  CheckCircle2, Lock, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useReferralCampaigns, Milestone } from '@/hooks/use-referral-campaigns';

interface ReferralMilestoneTrackerProps {
  compact?: boolean;
  showAll?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  'Star': <Star className="w-5 h-5" />,
  'TrendingUp': <TrendingUp className="w-5 h-5" />,
  'Users': <Users className="w-5 h-5" />,
  'Megaphone': <Megaphone className="w-5 h-5" />,
  'Award': <Award className="w-5 h-5" />,
  'Trophy': <Trophy className="w-5 h-5" />,
  'Crown': <Crown className="w-5 h-5" />,
  'Zap': <Zap className="w-5 h-5" />,
};

export const ReferralMilestoneTracker: React.FC<ReferralMilestoneTrackerProps> = ({
  compact = false,
  showAll = false,
}) => {
  const { milestones, nextMilestone, unclaimedMilestones, claimMilestoneReward, claimingMilestone } = useReferralCampaigns();

  if (!milestones || milestones.length === 0) return null;

  const displayMilestones = showAll ? milestones : milestones.slice(0, 4);

  const MilestoneCard: React.FC<{ milestone: Milestone; index: number }> = ({ milestone, index }) => {
    const isNext = milestone.milestone_id === nextMilestone?.milestone_id;
    const canClaim = milestone.is_unlocked && !milestone.reward_claimed;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative p-4 rounded-xl border transition-all ${
          milestone.is_unlocked 
            ? canClaim
              ? 'bg-yellow-500/20 border-yellow-400/50'
              : 'bg-green-500/10 border-green-400/30'
            : isNext
              ? 'bg-white/10 border-purple-400/50'
              : 'bg-white/5 border-white/10 opacity-60'
        }`}
      >
        {/* Badge icon */}
        <div className="flex items-start gap-3">
          <div 
            className={`p-3 rounded-xl ${
              milestone.is_unlocked 
                ? 'shadow-lg' 
                : 'opacity-50'
            }`}
            style={{ 
              backgroundColor: milestone.is_unlocked 
                ? `${milestone.badge_color}30` 
                : 'rgba(255,255,255,0.1)',
              color: milestone.badge_color || '#9CA3AF'
            }}
          >
            {milestone.is_unlocked ? (
              iconMap[milestone.badge_icon || 'Star'] || <Star className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-semibold truncate ${
                milestone.is_unlocked ? 'text-white' : 'text-blue-200'
              }`}>
                {milestone.milestone_name}
              </h4>
              {milestone.is_unlocked && !milestone.reward_claimed && (
                <Badge className="bg-yellow-500/30 text-yellow-400 text-xs">New!</Badge>
              )}
              {milestone.reward_claimed && (
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              )}
            </div>
            
            <p className="text-sm text-blue-200 mb-2">
              {milestone.milestone_count} referrals
            </p>

            {!milestone.is_unlocked && (
              <div className="space-y-1">
                <Progress 
                  value={milestone.progress_percent} 
                  className="h-2 bg-white/10" 
                />
                <p className="text-xs text-blue-300">
                  {milestone.progress_percent}% complete
                </p>
              </div>
            )}

            {canClaim && (
              <Button
                size="sm"
                onClick={() => claimMilestoneReward(milestone.milestone_id)}
                disabled={claimingMilestone}
                className="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900"
              >
                <Gift className="w-3 h-3 mr-1" />
                Claim {milestone.reward_points} pts
              </Button>
            )}
          </div>
        </div>

        {/* Connector line */}
        {index < displayMilestones.length - 1 && !compact && (
          <div className="absolute left-7 top-full w-0.5 h-4 bg-white/10" />
        )}
      </motion.div>
    );
  };

  if (compact) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Milestones</h3>
          </div>
          {unclaimedMilestones.length > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400">
              {unclaimedMilestones.length} to claim!
            </Badge>
          )}
        </div>

        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Next: {nextMilestone.milestone_name}</span>
              <span className="text-white font-medium">{nextMilestone.progress_percent}%</span>
            </div>
            <Progress value={nextMilestone.progress_percent} className="h-2 bg-white/10" />
            <p className="text-xs text-blue-300">
              {nextMilestone.milestone_count - Math.floor(nextMilestone.milestone_count * nextMilestone.progress_percent / 100)} more referrals needed
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-white">Achievement Milestones</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {milestones.filter(m => m.is_unlocked).length}/{milestones.length} Unlocked
            </Badge>
            {unclaimedMilestones.length > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 animate-pulse">
                {unclaimedMilestones.length} rewards!
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayMilestones.map((milestone, index) => (
            <MilestoneCard key={milestone.milestone_id} milestone={milestone} index={index} />
          ))}
        </div>

        {!showAll && milestones.length > 4 && (
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-white/20 text-blue-200 hover:bg-white/10">
              View All {milestones.length} Milestones
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
