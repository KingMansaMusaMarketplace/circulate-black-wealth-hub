import React from 'react';
import { Check } from 'lucide-react';
import { type TierInfo } from '@/lib/services/subscription-tiers';

interface TierFeaturesProps {
  tier: TierInfo;
}

interface FeatureRow {
  show: boolean;
  label: string;
}

export const TierFeatures: React.FC<TierFeaturesProps> = ({ tier }) => {
  const f = tier.features;

  const rows: FeatureRow[] = [
    { show: f.canScanQR, label: 'QR Code Scanning' },
    { show: f.canEarnPoints, label: 'Earn Loyalty Points' },
    { show: f.canRedeemRewards, label: 'Redeem Rewards' },
    { show: f.canAccessExclusiveDeals, label: 'Exclusive Deals' },
    { show: f.canCreateBusiness, label: 'Create Business Profile' },
    { show: f.canVerifyBusiness, label: 'Business Verification' },
    { show: f.canAccessAnalytics, label: 'Analytics Dashboard' },
    { show: f.canCreateEvents, label: 'Event Creation' },
    {
      show: f.maxQRCodes !== 0,
      label:
        f.maxQRCodes === -1 ? 'Unlimited QR Codes' : `${f.maxQRCodes} QR Codes`,
    },
    { show: f.canAccessRecordsManagement, label: 'Records Management' },
    { show: f.canAccessKaylaAI, label: 'Kayla AI Employee' },
    { show: f.canAccessMentorship, label: 'Mentorship Access' },
    { show: f.canAccessNetworking, label: 'Networking Access' },
    { show: f.canAccessPremiumSupport, label: 'Premium Support' },
  ];

  return (
    <div className="space-y-2">
      {tier.trialDays && tier.price > 0 && (
        <div className="flex items-center text-sm font-medium text-emerald-600">
          <Check className="h-4 w-4 mr-2" />
          <span>{tier.trialDays}-day free trial</span>
        </div>
      )}
      {rows
        .filter((r) => r.show)
        .map((r) => (
          <div key={r.label} className="flex items-center text-sm">
            <Check className="h-4 w-4 text-emerald-500 mr-2" />
            <span>{r.label}</span>
          </div>
        ))}
    </div>
  );
};
