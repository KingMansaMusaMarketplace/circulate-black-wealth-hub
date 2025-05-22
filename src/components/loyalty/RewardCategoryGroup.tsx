
import React from 'react';
import { Gift } from 'lucide-react';

interface LoyaltyReward {
  id: string | number;
  title: string;
  description: string;
  pointsCost: number;
  businessId?: string;
  businessName?: string;
  category?: string;
  expiresAt?: string;
  imageUrl?: string;
}

interface RewardCategoryGroupProps {
  title: string;
  rewards: LoyaltyReward[];
  children?: React.ReactNode;
}

const RewardCategoryGroup: React.FC<RewardCategoryGroupProps> = ({
  title,
  rewards,
  children
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-mansablue flex items-center">
        <Gift className="h-4 w-4 mr-2 text-mansagold" />
        {title} <span className="text-gray-500 ml-1">({rewards.length})</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};

export default RewardCategoryGroup;
