
export type SubscriptionTier = 'free' | 'premium' | 'business_starter' | 'business' | 'enterprise';

export interface TierFeatures {
  canScanQR: boolean;
  canEarnPoints: boolean;
  canRedeemRewards: boolean;
  canAccessExclusiveDeals: boolean;
  canCreateBusiness: boolean;
  canVerifyBusiness: boolean;
  canAccessAnalytics: boolean;
  canCreateEvents: boolean;
  canAccessPremiumSupport: boolean;
  canAccessMentorship: boolean;
  canAccessNetworking: boolean;
  maxQRCodes: number; // -1 for unlimited
}

export interface TierInfo {
  displayName: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: TierFeatures;
  popular?: boolean;
}

export const subscriptionTiers: Record<SubscriptionTier, TierInfo> = {
  free: {
    displayName: 'Community Member',
    description: 'Basic access to the marketplace',
    price: 0,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: false,
      canAccessExclusiveDeals: false,
      canCreateBusiness: false,
      canVerifyBusiness: false,
      canAccessAnalytics: false,
      canCreateEvents: false,
      canAccessPremiumSupport: false,
      canAccessMentorship: false,
      canAccessNetworking: false,
      maxQRCodes: 0
    }
  },
  premium: {
    displayName: 'Premium Member',
    description: 'Enhanced features and exclusive access',
    price: 4.99,
    interval: 'month',
    popular: true,
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: false,
      canVerifyBusiness: false,
      canAccessAnalytics: false,
      canCreateEvents: false,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
      maxQRCodes: 0
    }
  },
  business_starter: {
    displayName: 'Starter Business',
    description: 'Perfect for new and small businesses',
    price: 29,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: true,
      canVerifyBusiness: true,
      canAccessAnalytics: true,
      canCreateEvents: false,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
      maxQRCodes: 3
    }
  },
  business: {
    displayName: 'Professional Business',
    description: 'Full business management suite',
    price: 100,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: true,
      canVerifyBusiness: true,
      canAccessAnalytics: true,
      canCreateEvents: true,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
      maxQRCodes: 50
    }
  },
  enterprise: {
    displayName: 'Enterprise',
    description: 'Advanced features for large organizations',
    price: 500,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: true,
      canVerifyBusiness: true,
      canAccessAnalytics: true,
      canCreateEvents: true,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
      maxQRCodes: -1 // unlimited
    }
  }
};

export const getTierDisplayName = (tier: SubscriptionTier): string => {
  return subscriptionTiers[tier]?.displayName || 'Community Member';
};

export const getTierInfo = (tier: SubscriptionTier): TierInfo => {
  return subscriptionTiers[tier] || subscriptionTiers.free;
};

export const getFeatureAccess = (tier: SubscriptionTier): TierFeatures => {
  return subscriptionTiers[tier]?.features || subscriptionTiers.free.features;
};

export const getTierBenefits = (tier: SubscriptionTier): string[] => {
  const features = getFeatureAccess(tier);
  const benefits: string[] = [];
  
  if (features.canScanQR) benefits.push('QR Code Scanning');
  if (features.canEarnPoints) benefits.push('Earn Loyalty Points');
  if (features.canRedeemRewards) benefits.push('Redeem Rewards');
  if (features.canAccessExclusiveDeals) benefits.push('Exclusive Deals');
  if (features.canCreateBusiness) benefits.push('Create Business Profile');
  if (features.canAccessAnalytics) benefits.push('Analytics Dashboard');
  if (features.maxQRCodes > 0) benefits.push(`${features.maxQRCodes} QR Codes`);
  if (features.maxQRCodes === -1) benefits.push('Unlimited QR Codes');
  if (features.canAccessMentorship) benefits.push('Mentorship Access');
  if (features.canAccessPremiumSupport) benefits.push('Premium Support');
  
  return benefits;
};
