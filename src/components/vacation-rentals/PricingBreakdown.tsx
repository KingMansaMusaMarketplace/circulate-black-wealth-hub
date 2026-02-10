
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
      {/* Rate line */}
      <div className="flex justify-between text-sm">
        <span className="text-white/70">
          {pricing.pricingMode === 'monthly' && pricing.months
            ? `$${(pricing.monthlyRate ?? 0).toLocaleString()} × ${pricing.months} month${pricing.months !== 1 ? 's' : ''}`
            : pricing.pricingMode === 'weekly' && pricing.weeks
            ? `$${(pricing.weeklyRate ?? 0).toLocaleString()} × ${pricing.weeks} week${pricing.weeks !== 1 ? 's' : ''}`
            : `$${pricing.nightlyRate.toLocaleString()} × ${pricing.nights} night${pricing.nights !== 1 ? 's' : ''}`
          }
        </span>
        <span className="font-medium text-white">${pricing.subtotal.toLocaleString()}</span>
      </div>

      {/* Savings badge */}
      {pricing.nightlySavings && pricing.nightlySavings > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-green-400 font-medium">
            💰 You save vs nightly rate
          </span>
          <span className="text-green-400 font-medium">
            -${pricing.nightlySavings.toLocaleString()}
          </span>
        </div>
      )}

      {/* Cleaning fee */}
      {pricing.cleaningFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Cleaning fee</span>
          <span className="font-medium text-white">${pricing.cleaningFee.toLocaleString()}</span>
        </div>
      )}

      {/* Pet fee */}
      {pricing.petFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Pet fee</span>
          <span className="font-medium text-white">${pricing.petFee.toLocaleString()}</span>
        </div>
      )}

      {/* Platform fee */}
      <div className="flex justify-between text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-white/70 flex items-center gap-1 cursor-help">
                Service fee
                <Info className="w-3 h-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-white/20">
              <p className="max-w-xs text-xs text-white">
                This helps us run Mansa Stays and provides 24/7 support for your trip.
                A portion of this fee supports Black-owned community initiatives.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="font-medium text-white">${pricing.platformFee.toFixed(2)}</span>
      </div>

      <Separator className="bg-white/10" />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span className="text-white">Total</span>
        <span className="text-mansagold">${pricing.total.toFixed(2)}</span>
      </div>

      {/* Host payout (for hosts) */}
      {showHostPayout && (
        <>
          <Separator className="bg-white/10" />
          <div className="flex justify-between text-sm text-mansagold">
            <span>You'll receive</span>
            <span className="font-semibold">${pricing.hostPayout.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PricingBreakdown;
