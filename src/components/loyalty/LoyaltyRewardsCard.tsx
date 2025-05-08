
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, GiftIcon } from 'lucide-react';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import { useAuth } from '@/contexts/AuthContext';
import RewardDetailsView from './RewardDetailsView';
import RedemptionConfirmDialog from './RedemptionConfirmDialog';
import EmptyRewardsState from './EmptyRewardsState';
import RewardCategoryGroup from './RewardCategoryGroup';

interface LoyaltyRewardsCardProps {
  totalPoints: number;
  availableRewards: LoyaltyReward[];
  onRedeemReward: (rewardId: string, pointsCost: number) => Promise<boolean>;
}

const LoyaltyRewardsCard: React.FC<LoyaltyRewardsCardProps> = ({
  totalPoints,
  availableRewards,
  onRedeemReward
}) => {
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Group rewards by category
  const groupedRewards = availableRewards.reduce((acc, reward) => {
    const category = reward.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(reward);
    return acc;
  }, {} as Record<string, LoyaltyReward[]>);

  // Sort rewards by points cost (lowest first)
  const sortedCategories = Object.keys(groupedRewards).sort();
  
  const handleShowConfirmation = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };
  
  const handleShowDetails = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setDetailsDialogOpen(true);
  };
  
  const handleConfirmRedeem = async () => {
    if (!selectedReward || !user) return;
    
    setIsRedeeming(true);
    
    try {
      const success = await onRedeemReward(selectedReward.id, selectedReward.pointsCost);
      
      if (success) {
        // Dialog will close automatically on success
        setConfirmDialogOpen(false);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg font-semibold">
              <GiftIcon className="h-5 w-5 mr-2 text-mansagold" />
              Available Rewards
            </CardTitle>
            <Badge variant="outline" className="bg-mansablue/10 text-mansablue">
              {totalPoints} Points Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-6">
              {sortedCategories.map(category => (
                <RewardCategoryGroup
                  key={category}
                  category={category}
                  rewards={groupedRewards[category]}
                  totalPoints={totalPoints}
                  onShowDetails={handleShowDetails}
                  onShowConfirmation={handleShowConfirmation}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <EmptyRewardsState />
          )}
        </CardContent>
      </Card>

      {/* Redemption Confirmation Dialog */}
      <RedemptionConfirmDialog
        reward={selectedReward}
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmRedeem}
        isRedeeming={isRedeeming}
        totalPoints={totalPoints}
      />

      {/* Reward Details Dialog */}
      <RewardDetailsView
        reward={selectedReward}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        totalPoints={totalPoints}
        onRedeem={() => {
          setDetailsDialogOpen(false);
          setConfirmDialogOpen(true);
        }}
        isRedeeming={isRedeeming}
      />
    </>
  );
};

export default LoyaltyRewardsCard;
