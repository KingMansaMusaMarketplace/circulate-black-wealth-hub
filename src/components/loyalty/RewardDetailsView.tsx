
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock, Gift, Store, Calendar, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
          className="p-0 mr-2 text-mansablue hover:bg-mansablue/5 hover:text-mansablue-dark"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to rewards
        </Button>
        {actionButton && (
          <div className="ml-auto">
            {actionButton}
          </div>
        )}
      </div>
      
      <div className="h-60 overflow-hidden rounded-lg shadow-md relative">
        {reward.imageUrl ? (
          <img 
            src={reward.imageUrl} 
            alt={reward.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-mansablue/10 to-blue-50">
            <div className="text-center">
              <Gift className="h-16 w-16 mx-auto text-mansablue opacity-40" />
              <span className="font-bold text-xl text-mansablue mt-2 block">{reward.businessName || 'Reward'}</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-0 right-0 m-3">
          <Badge className="bg-mansablue text-white border-none">
            {reward.pointsCost.toLocaleString()} points
          </Badge>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold text-mansablue mb-1">{reward.title}</h2>
        
        <div className="flex flex-wrap gap-3 mt-3">
          {reward.businessName && (
            <div className="flex items-center text-sm text-gray-600">
              <Store className="h-4 w-4 mr-1 text-mansablue" />
              {reward.businessName}
            </div>
          )}
          
          {hasExpiration && expireDate && (
            <div className="flex items-center text-sm ml-auto">
              <Calendar className={`h-4 w-4 mr-1 ${isExpiringSoon ? 'text-red-500' : 'text-mansablue'}`} />
              <span className={isExpiringSoon ? 'text-red-500 font-medium' : 'text-gray-600'}>
                Expires {formatDistanceToNow(expireDate, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {reward.description && (
        <div className="bg-white p-5 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-mansablue mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            About This Reward
          </h3>
          <p className="text-gray-700">{reward.description}</p>
        </div>
      )}
      
      <Button 
        className={`w-full ${canRedeem ? 'bg-mansablue hover:bg-mansablue-dark' : 'bg-gray-300'}`}
        disabled={!canRedeem}
        onClick={onRedeemClick}
      >
        {canRedeem ? (
          <>
            <Gift className="mr-2 h-4 w-4" /> Redeem Reward
          </>
        ) : (
          <>
            <Clock className="mr-2 h-4 w-4" /> Need {pointsNeeded} more points
          </>
        )}
      </Button>
    </div>
  );
}

export default RewardDetailsView;
