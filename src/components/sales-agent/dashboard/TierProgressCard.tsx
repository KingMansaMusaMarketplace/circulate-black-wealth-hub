import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy, Star, Award } from 'lucide-react';
import { getAgentTierProgress } from '@/lib/api/sales-agent-api';

interface TierProgressCardProps {
  agentId: string;
}

const TierProgressCard: React.FC<TierProgressCardProps> = ({ agentId }) => {
  const [progress, setProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [agentId]);

  const loadProgress = async () => {
    try {
      const data = await getAgentTierProgress(agentId);
      setProgress(data);
    } catch (error) {
      console.error('Error loading tier progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return <Award className="h-5 w-5" />;
      case 'gold':
        return <Trophy className="h-5 w-5" />;
      case 'silver':
        return <Star className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'text-purple-600 bg-purple-100';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'silver':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-amber-700 bg-amber-100';
    }
  };

  const getTierBenefits = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return {
          commission: '15%',
          override: '7.5%',
          bonus: '$100',
          requirements: '50+ referrals'
        };
      case 'gold':
        return {
          commission: '12.5%',
          override: '7.5%',
          bonus: '$75',
          requirements: '25-49 referrals'
        };
      case 'silver':
        return {
          commission: '11%',
          override: '7.5%',
          bonus: '$75',
          requirements: '10-24 referrals'
        };
      default:
        return {
          commission: '10%',
          override: '7.5%',
          bonus: '$75',
          requirements: '0-9 referrals'
        };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!progress) return null;

  const currentBenefits = getTierBenefits(progress.current_tier);
  const isMaxTier = progress.current_tier.toLowerCase() === 'platinum';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTierIcon(progress.current_tier)}
          Tier Progress
        </CardTitle>
        <CardDescription>
          Upgrade your tier by referring more businesses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Tier Badge */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Tier</p>
            <Badge className={`${getTierColor(progress.current_tier)} text-lg py-1 px-3 capitalize`}>
              {progress.current_tier}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Commission Rate</p>
            <p className="text-2xl font-bold text-primary">{currentBenefits.commission}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isMaxTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress to {progress.next_tier}
              </span>
              <span className="font-medium">
                {progress.current_referrals} / {progress.next_tier_threshold} referrals
              </span>
            </div>
            <Progress value={Number(progress.progress_percentage)} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {progress.next_tier_threshold - progress.current_referrals} more referrals needed
            </p>
          </div>
        )}

        {isMaxTier && (
          <div className="text-center py-4 bg-primary/5 rounded-lg">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium text-primary">You've reached the highest tier!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep referring to maximize your earnings
            </p>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Team Override</p>
            <p className="text-sm font-semibold">{currentBenefits.override}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Recruitment Bonus</p>
            <p className="text-sm font-semibold">{currentBenefits.bonus}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TierProgressCard;
