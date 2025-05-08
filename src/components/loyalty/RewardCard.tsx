
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';

interface RewardCardProps {
  reward: LoyaltyReward;
  totalPoints: number;
  onShowDetails: (reward: LoyaltyReward) => void;
  onShowConfirmation: (reward: LoyaltyReward) => void;
  user: any;
}

const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  totalPoints,
  onShowDetails,
  onShowConfirmation,
  user
}) => {
  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresAt?: string): number | null => {
    if (!expiresAt) return null;
    
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilExpiry = getDaysUntilExpiration(reward.expiresAt);
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 5;
  const progress = Math.min((totalPoints / reward.pointsCost) * 100, 100);
  
  return (
    <div 
      key={reward.id} 
      className="border rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{reward.title}</div>
          <div className="text-sm text-gray-500 mt-1">{reward.description}</div>
          {reward.businessName && (
            <div className="text-xs text-mansablue mt-1">
              {reward.businessName}
            </div>
          )}
        </div>
        <Badge variant="secondary" className="bg-gray-100">
          {reward.pointsCost} pts
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mt-3 mb-1">
        <div className="flex justify-between text-xs mb-1">
          <span>{totalPoints} / {reward.pointsCost}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Expiration badge */}
      {daysUntilExpiry !== null && (
        <div className={`text-xs flex items-center mt-2 mb-2 ${isExpiringSoon ? 'text-red-500' : 'text-amber-600'}`}>
          {isExpiringSoon ? (
            <AlertTriangle size={14} className="mr-1" />
          ) : (
            <Clock size={14} className="mr-1" />
          )}
          {daysUntilExpiry === 0 ? (
            <span>Expires today!</span>
          ) : (
            <span>Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}</span>
          )}
        </div>
      )}
      
      <div className="flex gap-2 mt-3">
        <Button 
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onShowDetails(reward)}
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
        <Button 
          size="sm"
          className="flex-1"
          variant={totalPoints >= reward.pointsCost ? "default" : "outline"}
          disabled={totalPoints < reward.pointsCost || !user}
          onClick={() => onShowConfirmation(reward)}
        >
          {totalPoints >= reward.pointsCost ? 'Redeem' : `Need ${reward.pointsCost - totalPoints} more`}
        </Button>
      </div>
    </div>
  );
};

export default RewardCard;
