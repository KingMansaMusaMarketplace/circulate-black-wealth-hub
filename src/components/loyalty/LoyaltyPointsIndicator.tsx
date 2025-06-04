
import React from 'react';
import { Award } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';

export const LoyaltyPointsIndicator: React.FC = () => {
  const { summary, loading } = useLoyalty();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Award className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    );
  }

  const totalPoints = summary?.totalPoints || 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Award className="h-4 w-4 text-yellow-500" />
      <span className="font-medium text-gray-700">
        {totalPoints} {totalPoints === 1 ? 'point' : 'points'}
      </span>
    </div>
  );
};
