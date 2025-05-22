
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RewardCard } from './RewardCard';
import { RewardDetailsView } from './RewardDetailsView';
import RewardCategoryGroup from './RewardCategoryGroup';
import EmptyRewardsState from './EmptyRewardsState';
import RedemptionConfirmDialog from './RedemptionConfirmDialog';
import SocialShareDialog from './SocialShareDialog';
import { Award, Gift, ChevronUp, ChevronDown } from 'lucide-react';

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const canRedeem = selectedReward && totalPoints >= selectedReward.pointsCost;
  
  // Prepare sharing content
  const getShareContent = (reward: Reward) => ({
    title: `Check out this reward from Mansa Musa!`,
    text: `I found "${reward.title}" for ${reward.pointsCost} points on Mansa Musa. Join me in supporting Black-owned businesses!`,
    customPath: `/loyalty`
  });

  return (
    <Card className="h-full overflow-hidden border-blue-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-mansablue/10 to-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2 text-mansablue">
            <Gift className="h-5 w-5 text-mansagold" />
            Available Rewards
          </CardTitle>
          <div className="bg-mansablue text-white text-sm font-medium rounded-full px-3 py-1 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            {totalPoints.toLocaleString()} Points Available
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
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
          <div className="space-y-8">
            {Object.entries(rewardsByCategory).map(([category, rewards]) => {
              const isExpanded = expandedCategories[category] !== false; // Default to expanded
              
              return (
                <div key={category} className="border border-blue-100 rounded-lg overflow-hidden bg-white">
                  <div 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-mansablue/5 to-blue-50 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <h3 className="text-mansablue font-medium flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-mansagold" />
                      {category} ({rewards.length})
                    </h3>
                    {isExpanded ? 
                      <ChevronUp className="h-4 w-4 text-mansablue" /> : 
                      <ChevronDown className="h-4 w-4 text-mansablue" />
                    }
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
