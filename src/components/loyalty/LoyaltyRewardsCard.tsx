
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RewardCard } from './RewardCard';
import { RewardDetailsView } from './RewardDetailsView';
import RewardCategoryGroup from './RewardCategoryGroup';
import EmptyRewardsState from './EmptyRewardsState';
import RedemptionConfirmDialog from './RedemptionConfirmDialog';
import { SocialShareDialog } from './SocialShareDialog';

interface Reward {
  id: string | number;
  title: string;
  description: string;
  pointsCost: number;
  businessId?: string;
  businessName?: string;
  category: string;
  expiresAt?: string;
  imageUrl?: string;
}

interface LoyaltyRewardsCardProps {
  totalPoints: number;
  availableRewards: Reward[];
  onRedeemReward: (rewardId: string | number, pointsCost: number) => Promise<boolean> | void;
}

export function LoyaltyRewardsCard({ 
  totalPoints, 
  availableRewards, 
  onRedeemReward 
}: LoyaltyRewardsCardProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redemptionDialogOpen, setRedemptionDialogOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  // Group rewards by category
  const rewardsByCategory = availableRewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);
  
  const handleRewardSelect = (reward: Reward) => {
    setSelectedReward(reward);
  };
  
  const handleRewardClose = () => {
    setSelectedReward(null);
  };
  
  const handleRedeemClick = () => {
    if (selectedReward) {
      setRedemptionDialogOpen(true);
    }
  };
  
  const handleRedeemConfirm = async () => {
    if (selectedReward) {
      setIsRedeeming(true);
      try {
        await onRedeemReward(selectedReward.id, selectedReward.pointsCost);
      } finally {
        setIsRedeeming(false);
        setRedemptionDialogOpen(false);
        setSelectedReward(null);
      }
    }
  };

  const canRedeem = selectedReward && totalPoints >= selectedReward.pointsCost;
  
  // Prepare sharing content
  const getShareContent = (reward: Reward) => ({
    title: `Check out this reward from Mansa Musa!`,
    text: `I found "${reward.title}" for ${reward.pointsCost} points on Mansa Musa. Join me in supporting Black-owned businesses!`,
    customPath: `/loyalty`
  });

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Available Rewards</CardTitle>
          <div className="bg-mansablue/10 text-mansablue text-sm font-medium rounded-full px-3 py-1">
            {totalPoints.toLocaleString()} Points Available
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {availableRewards.length === 0 ? (
          <EmptyRewardsState />
        ) : selectedReward ? (
          <RewardDetailsView 
            reward={selectedReward} 
            onBackClick={handleRewardClose}
            onRedeemClick={handleRedeemClick}
            canRedeem={canRedeem}
            pointsNeeded={selectedReward.pointsCost - totalPoints}
            actionButton={
              <SocialShareDialog 
                {...getShareContent(selectedReward)}
                triggerContent={<span className="text-sm text-mansablue cursor-pointer hover:underline">Share Reward</span>}
              />
            }
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(rewardsByCategory).map(([category, rewards]) => (
              <RewardCategoryGroup key={category} title={category} rewards={rewards}>
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    title={reward.title}
                    pointsCost={reward.pointsCost}
                    businessName={reward.businessName}
                    imageUrl={reward.imageUrl}
                    expiresAt={reward.expiresAt}
                    onClick={() => handleRewardSelect(reward)}
                    actionButton={
                      <SocialShareDialog 
                        {...getShareContent(reward)}
                        triggerContent={<span className="text-sm text-mansablue cursor-pointer hover:underline">Share</span>}
                      />
                    }
                  />
                ))}
              </RewardCategoryGroup>
            ))}
          </div>
        )}
        
        {selectedReward && (
          <RedemptionConfirmDialog 
            open={redemptionDialogOpen}
            onOpenChange={setRedemptionDialogOpen}
            reward={selectedReward}
            onConfirm={handleRedeemConfirm}
            totalPoints={totalPoints}
            isRedeeming={isRedeeming}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default LoyaltyRewardsCard;
