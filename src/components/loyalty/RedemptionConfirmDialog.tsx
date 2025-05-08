
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { LoyaltyReward } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';

interface RedemptionConfirmDialogProps {
  reward: LoyaltyReward | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRedeeming: boolean;
  totalPoints: number;
}

const RedemptionConfirmDialog: React.FC<RedemptionConfirmDialogProps> = ({
  reward,
  open,
  onClose,
  onConfirm,
  isRedeeming,
  totalPoints
}) => {
  if (!reward) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Redemption</DialogTitle>
          <DialogDescription>
            You're about to redeem this reward using your loyalty points
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{reward.title}</h3>
              <p className="text-gray-500 text-sm">{reward.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Points Cost:</p>
              <p>Your Available Points:</p>
              <p>Remaining After Redemption:</p>
            </div>
            <div className="text-right font-medium">
              <p>{reward.pointsCost} points</p>
              <p>{totalPoints} points</p>
              <p>{totalPoints - reward.pointsCost} points</p>
            </div>
          </div>
          
          {reward.businessName && (
            <div className="text-sm bg-blue-50 p-3 rounded mb-4">
              <span className="font-medium">Redeemable at:</span> {reward.businessName}
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            This action cannot be undone. Once redeemed, your points will be deducted and the reward will be added to your account.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRedeeming}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-mansablue hover:bg-mansablue/80"
            disabled={isRedeeming || !reward}
          >
            {isRedeeming ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Confirm Redemption</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionConfirmDialog;
