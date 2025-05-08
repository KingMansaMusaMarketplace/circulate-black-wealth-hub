
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

interface RewardDetailsViewProps {
  reward: {
    title: string;
    description: string;
    pointsCost: number;
    businessName?: string;
    imageUrl?: string;
    expiresAt?: string;
  };
  onBackClick: () => void;
  onRedeemClick: () => void;
  canRedeem: boolean;
  pointsNeeded?: number;
  actionButton?: React.ReactNode;
}

export function RewardDetailsView({
  reward,
  onBackClick,
  onRedeemClick,
  canRedeem,
  pointsNeeded = 0,
  actionButton
}: RewardDetailsViewProps) {
  const hasExpiration = Boolean(reward.expiresAt);
  const expireDate = reward.expiresAt ? new Date(reward.expiresAt) : null;
  const isExpiringSoon = expireDate && expireDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 mr-2"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {actionButton && (
          <div className="ml-auto">
            {actionButton}
          </div>
        )}
      </div>
      
      <div className="h-48 overflow-hidden rounded-lg">
        {reward.imageUrl ? (
          <img 
            src={reward.imageUrl} 
            alt={reward.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-mansablue/20 to-mansagold/20">
            <span className="font-bold text-lg text-mansablue">{reward.businessName || 'Reward'}</span>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold">{reward.title}</h2>
        {reward.businessName && (
          <p className="text-gray-500 mt-1">{reward.businessName}</p>
        )}
      </div>
      
      <div className="flex justify-between items-center py-2 border-t border-b">
        <div>
          <span className="text-sm text-gray-500">Points Required</span>
          <p className="font-bold text-lg text-mansablue">{reward.pointsCost.toLocaleString()} pts</p>
        </div>
        {hasExpiration && expireDate && (
          <div className="text-right">
            <span className="text-sm text-gray-500">Expires</span>
            <p className={`font-medium ${isExpiringSoon ? 'text-red-500' : 'text-gray-700'}`}>
              {formatDistanceToNow(expireDate, { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
      
      {reward.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{reward.description}</p>
        </div>
      )}
      
      <Button 
        className="w-full" 
        disabled={!canRedeem}
        onClick={onRedeemClick}
      >
        {canRedeem ? 'Redeem Reward' : `Need ${pointsNeeded} more points`}
      </Button>
    </div>
  );
}

export default RewardDetailsView;
