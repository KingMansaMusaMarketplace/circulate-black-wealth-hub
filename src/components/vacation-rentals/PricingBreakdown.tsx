
import React from 'react';
import { PricingBreakdown as PricingBreakdownType } from '@/types/vacation-rental';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface PricingBreakdownProps {
  pricing: PricingBreakdownType;
  showHostPayout?: boolean;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  pricing,
  showHostPayout = false,
}) => {
  return (
    <div className="space-y-3">
      {/* Nightly rate */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          ${pricing.nightlyRate.toLocaleString()} × {pricing.nights} night{pricing.nights !== 1 ? 's' : ''}
        </span>
        <span className="font-medium">${pricing.subtotal.toLocaleString()}</span>
      </div>

      {/* Cleaning fee */}
      {pricing.cleaningFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cleaning fee</span>
          <span className="font-medium">${pricing.cleaningFee.toLocaleString()}</span>
        </div>
      )}

      {/* Pet fee */}
      {pricing.petFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pet fee</span>
          <span className="font-medium">${pricing.petFee.toLocaleString()}</span>
        </div>
      )}

      {/* Platform fee */}
      <div className="flex justify-between text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground flex items-center gap-1 cursor-help">
                Service fee
                <Info className="w-3 h-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                This helps us run Mansa Stays and provides 24/7 support for your trip.
                A portion of this fee supports Black-owned community initiatives.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="font-medium">${pricing.platformFee.toFixed(2)}</span>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${pricing.total.toFixed(2)}</span>
      </div>

      {/* Host payout (for hosts) */}
      {showHostPayout && (
        <>
          <Separator />
          <div className="flex justify-between text-sm text-primary">
            <span>You'll receive</span>
            <span className="font-semibold">${pricing.hostPayout.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PricingBreakdown;
