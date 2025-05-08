
import React from 'react';
import { Gift } from 'lucide-react';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import RewardCard from './RewardCard';

interface RewardCategoryGroupProps {
  category: string;
  rewards: LoyaltyReward[];
  totalPoints: number;
  onShowDetails: (reward: LoyaltyReward) => void;
  onShowConfirmation: (reward: LoyaltyReward) => void;
  user: any;
}

const RewardCategoryGroup: React.FC<RewardCategoryGroupProps> = ({
  category,
  rewards,
  totalPoints,
  onShowDetails,
  onShowConfirmation,
  user
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rewards.map(reward => (
          <RewardCard
            key={reward.id}
            reward={reward}
            totalPoints={totalPoints}
            onShowDetails={onShowDetails}
            onShowConfirmation={onShowConfirmation}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardCategoryGroup;
