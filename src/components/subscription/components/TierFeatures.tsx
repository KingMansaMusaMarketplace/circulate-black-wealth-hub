
import React from 'react';
import { Check } from 'lucide-react';
import { type TierInfo } from '@/lib/services/subscription-tiers';

interface TierFeaturesProps {
  tier: TierInfo;
}

export const TierFeatures: React.FC<TierFeaturesProps> = ({ tier }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <Check className="h-4 w-4 text-green-500 mr-2" />
        <span>QR Code Scanning</span>
      </div>
      
      <div className="flex items-center text-sm">
        <Check className="h-4 w-4 text-green-500 mr-2" />
        <span>Earn Loyalty Points</span>
      </div>

      {tier.features.canRedeemRewards && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Redeem Rewards</span>
        </div>
      )}

      {tier.features.canAccessExclusiveDeals && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Exclusive Deals</span>
        </div>
      )}

      {tier.features.canCreateBusiness && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Create Business Profile</span>
        </div>
      )}

      {tier.features.canAccessAnalytics && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Analytics Dashboard</span>
        </div>
      )}

      {tier.features.maxQRCodes > 0 && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>
            {tier.features.maxQRCodes === -1 
              ? 'Unlimited QR Codes' 
              : `${tier.features.maxQRCodes} QR Codes`
            }
          </span>
        </div>
      )}

      {tier.features.canAccessMentorship && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Mentorship Access</span>
        </div>
      )}

      {tier.features.canAccessPremiumSupport && (
        <div className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2" />
          <span>Premium Support</span>
        </div>
      )}
    </div>
  );
};
