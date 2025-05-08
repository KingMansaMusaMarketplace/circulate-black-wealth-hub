
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';
import { 
  Award, 
  Clock, 
  Info, 
  Share, 
  AlertTriangle,
  Gift
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RewardDetailsViewProps {
  reward: LoyaltyReward | null;
  open: boolean;
  onClose: () => void;
  totalPoints: number;
  onRedeem: () => void;
  isRedeeming: boolean;
}

const RewardDetailsView: React.FC<RewardDetailsViewProps> = ({
  reward,
  open,
  onClose,
  totalPoints,
  onRedeem,
  isRedeeming
}) => {
  if (!reward) return null;

  // Calculate progress percentage
  const progress = Math.min((totalPoints / reward.pointsCost) * 100, 100);
  
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-mansagold" />
            {reward.title}
          </DialogTitle>
          <DialogDescription>
            Reward details and redemption information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Reward Hero Section */}
          <div className="bg-mansablue/5 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{reward.title}</h3>
              <Badge variant="outline" className="bg-mansablue/10 text-mansablue">
                {reward.pointsCost} pts
              </Badge>
            </div>
            <p className="text-gray-600">{reward.description}</p>
            {reward.businessName && (
              <div className="flex items-center gap-1 text-sm text-mansablue">
                <Award className="h-4 w-4" />
                <span>Provided by {reward.businessName}</span>
              </div>
            )}
          </div>

          {/* Points Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Your progress</span>
              <span className="font-medium">{totalPoints} / {reward.pointsCost} points</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-right text-xs text-gray-500">
              {progress < 100 ? (
                <span>You need {reward.pointsCost - totalPoints} more points</span>
              ) : (
                <span className="text-green-600">Ready to redeem!</span>
              )}
            </div>
          </div>

          {/* Expiration Info */}
          {daysUntilExpiry !== null && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isExpiringSoon ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              {isExpiringSoon ? (
                <AlertTriangle size={18} />
              ) : (
                <Clock size={18} />
              )}
              <div>
                <p className="font-medium text-sm">
                  {daysUntilExpiry === 0 ? (
                    "Expires today!"
                  ) : (
                    `Expires in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}`
                  )}
                </p>
                <p className="text-xs">Don't miss out on this reward!</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Once redeemed, the points will be deducted from your account.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Share size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Share this reward with friends and family.
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between border-t pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRedeeming}
          >
            Cancel
          </Button>
          <Button
            onClick={onRedeem}
            className="bg-mansablue hover:bg-mansablue/80"
            disabled={isRedeeming || totalPoints < reward.pointsCost}
          >
            {isRedeeming ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : totalPoints < reward.pointsCost ? (
              `Need ${reward.pointsCost - totalPoints} more points`
            ) : (
              `Redeem for ${reward.pointsCost} points`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDetailsView;
