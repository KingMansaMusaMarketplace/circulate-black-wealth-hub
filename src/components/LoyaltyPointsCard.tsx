
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LoyaltyPointsCardProps {
  points: number;
  target: number;
  saved: number;
}

const LoyaltyPointsCard = ({ points, target, saved }: LoyaltyPointsCardProps) => {
  const progress = Math.min(100, (points / target) * 100);
  const remaining = target - points;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Loyalty Points</h3>
          <p className="text-sm text-gray-500">Track your rewards progress</p>
        </div>
        <div className="bg-mansagold text-white text-sm font-bold rounded-full px-3 py-1">
          {points} pts
        </div>
      </div>
      
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Progress to next reward</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 mb-1" />
      <p className="text-xs text-gray-500">{remaining > 0 ? `${remaining} more points until your next reward` : 'You can redeem a reward now!'}</p>
      
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Total Savings</span>
            <p className="text-xl font-bold text-mansablue">${saved.toFixed(2)}</p>
          </div>
          <button className="text-sm bg-mansablue text-white px-3 py-2 rounded-md font-medium">
            Redeem Points
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPointsCard;
