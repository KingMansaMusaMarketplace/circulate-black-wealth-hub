
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, Clock } from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  expiresAt?: string;
}

interface RewardsTabProps {
  availablePoints: number;
  rewards: Reward[];
  onRedeem: (rewardId: number, pointsCost: number) => void;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  availablePoints,
  rewards,
  onRedeem
}) => {
  // Group rewards by category
  const rewardsByCategory = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <div className="space-y-6">
      {/* Available Points Banner */}
      <div className="bg-mansablue rounded-lg p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <Award className="mr-2" size={24} />
          <div>
            <h3 className="font-bold">Available Points</h3>
            <p className="text-sm opacity-90">Use your points to redeem these rewards</p>
          </div>
        </div>
        <div className="text-2xl font-bold">{availablePoints}</div>
      </div>
      
      {/* Rewards by Category */}
      {Object.entries(rewardsByCategory).map(([category, categoryRewards]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Gift size={18} className="mr-2 text-mansagold" />
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <CardDescription>
                    {reward.expiresAt && (
                      <div className="flex items-center text-amber-600">
                        <Clock size={14} className="mr-1" />
                        Expires: {reward.expiresAt}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-sm">{reward.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="font-medium text-mansablue">{reward.pointsCost} points</div>
                  <Button
                    onClick={() => onRedeem(reward.id, reward.pointsCost)}
                    disabled={availablePoints < reward.pointsCost}
                    size="sm"
                    variant={availablePoints >= reward.pointsCost ? "default" : "outline"}
                  >
                    Redeem
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {/* Empty State */}
      {Object.keys(rewardsByCategory).length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-md">
          <Gift size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Rewards Available</h3>
          <p className="text-gray-500">Check back later for exciting rewards!</p>
        </div>
      )}
    </div>
  );
};

export default RewardsTab;
