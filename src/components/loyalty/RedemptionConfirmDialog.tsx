
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle2, AlertCircle } from "lucide-react";

interface RedemptionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: {
    id: string | number;
    title: string;
    description: string;
    pointsCost: number;
    businessName?: string;
  };
  onConfirm: () => void;
  totalPoints: number;
  isRedeeming: boolean;
}

const RedemptionConfirmDialog: React.FC<RedemptionConfirmDialogProps> = ({
  open,
  onOpenChange,
  reward,
  onConfirm,
  totalPoints,
  isRedeeming
}) => {
  const remainingPoints = totalPoints - reward.pointsCost;
  const canAfford = remainingPoints >= 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-blue-100">
        <DialogHeader className="bg-gradient-to-r from-mansablue/10 to-blue-50 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg">
          <DialogTitle className="text-xl text-mansablue flex items-center gap-2">
            <Gift className="h-5 w-5 text-mansagold" />
            Confirm Redemption
          </DialogTitle>
          <DialogDescription>
            You're about to redeem the following reward:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-mansablue/10 flex items-center justify-center text-mansablue">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-mansablue">{reward.title}</h3>
              <p className="text-gray-500 text-sm">{reward.description}</p>
              {reward.businessName && (
                <p className="text-sm text-mansablue-light">{reward.businessName}</p>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-600">
                <p>Points Cost:</p>
                <p>Your Available Points:</p>
                <p className="font-medium">Remaining After Redemption:</p>
              </div>
              <div className="text-right font-medium">
                <p>{reward.pointsCost.toLocaleString()} points</p>
                <p>{totalPoints.toLocaleString()} points</p>
                <p className={remainingPoints >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {remainingPoints.toLocaleString()} points
                </p>
              </div>
            </div>
          </div>
          
          {canAfford ? (
            <div className="flex items-start p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                This action cannot be undone. Once redeemed, your points will be deducted and you'll receive a confirmation code.
              </p>
            </div>
          ) : (
            <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                You don't have enough points to redeem this reward. You need {Math.abs(remainingPoints)} more points.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRedeeming}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isRedeeming || !canAfford}
            className="bg-mansablue hover:bg-mansablue-dark"
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
