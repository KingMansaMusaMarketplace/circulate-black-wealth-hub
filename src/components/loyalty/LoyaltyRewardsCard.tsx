
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Gift, GiftIcon, CheckCircle } from 'lucide-react';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const handleRedeem = async (reward: LoyaltyReward) => {
    if (!user) {
      return;
    }
    
    await onRedeemReward(reward.id, reward.pointsCost);
  };

  return (
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
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedRewards[category].map(reward => (
                    <div 
                      key={reward.id} 
                      className="border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{reward.title}</div>
                        <div className="text-sm text-gray-500">{reward.description}</div>
                        {reward.businessName && (
                          <div className="text-xs text-mansablue mt-1">
                            {reward.businessName}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="bg-gray-100">
                          {reward.pointsCost} pts
                        </Badge>
                        <Button 
                          size="sm" 
                          variant={totalPoints >= reward.pointsCost ? "default" : "outline"}
                          disabled={totalPoints < reward.pointsCost || !user}
                          onClick={() => handleRedeem(reward)}
                          className="mt-1"
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Gift className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium">No Rewards Available</h3>
            <p className="text-gray-500 text-sm mt-1">
              Check back soon for exciting loyalty rewards!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyRewardsCard;
