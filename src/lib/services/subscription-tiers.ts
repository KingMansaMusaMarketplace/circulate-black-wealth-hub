
export type SubscriptionTier = 'free' | 'premium' | 'business' | 'enterprise';

export interface TierFeatures {
  canScanQR: boolean;
  canEarnPoints: boolean;
  canRedeemRewards: boolean;
  canAccessExclusiveDeals: boolean;
  canCreateBusiness: boolean;
  canVerifyBusiness: boolean;
  maxBusinessListings: number;
  canAccessAnalytics: boolean;
  canCreateEvents: boolean;
  maxQRCodes: number;
  canAccessPremiumSupport: boolean;
  canAccessMentorship: boolean;
  canAccessNetworking: boolean;
}

export interface TierInfo {
  name: string;
  displayName: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: TierFeatures;
  stripePriceId?: string;
  popular?: boolean;
}

export const subscriptionTiers: Record<SubscriptionTier, TierInfo> = {
  free: {
    name: 'free',
    displayName: 'Community Member',
    description: 'Basic access to support Black-owned businesses',
    price: 0,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: false,
      canAccessExclusiveDeals: false,
      canCreateBusiness: false,
      canVerifyBusiness: false,
      maxBusinessListings: 0,
      canAccessAnalytics: false,
      canCreateEvents: false,
      maxQRCodes: 0,
      canAccessPremiumSupport: false,
      canAccessMentorship: false,
      canAccessNetworking: false,
    }
  },
  premium: {
    name: 'premium',
    displayName: 'Wealth Builder',
    description: 'Enhanced features for maximizing your impact',
    price: 9.99,
    interval: 'month',
    popular: true,
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: false,
      canVerifyBusiness: false,
      maxBusinessListings: 0,
      canAccessAnalytics: true,
      canCreateEvents: false,
      maxQRCodes: 0,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
    }
  },
  business: {
    name: 'business',
    displayName: 'Business Owner',
    description: 'Complete toolkit for Black business owners',
    price: 49.99,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: true,
      canVerifyBusiness: true,
      maxBusinessListings: 3,
      canAccessAnalytics: true,
      canCreateEvents: true,
      maxQRCodes: 10,
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
    }
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'Advanced features for established businesses',
    price: 199.99,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: true,
      canVerifyBusiness: true,
      maxBusinessListings: -1, // unlimited
      canAccessAnalytics: true,
      canCreateEvents: true,
      maxQRCodes: -1, // unlimited
      canAccessPremiumSupport: true,
      canAccessMentorship: true,
      canAccessNetworking: true,
    }
  }
};

export const getFeatureAccess = (tier: SubscriptionTier): TierFeatures => {
  return subscriptionTiers[tier]?.features || subscriptionTiers.free.features;
};

export const getTierDisplayName = (tier: SubscriptionTier): string => {
  return subscriptionTiers[tier]?.displayName || 'Community Member';
};

export const getTierInfo = (tier: SubscriptionTier): TierInfo => {
  return subscriptionTiers[tier] || subscriptionTiers.free;
};

export const canAccessFeature = (userTier: SubscriptionTier, feature: keyof TierFeatures): boolean => {
  const features = getFeatureAccess(userTier);
  return features[feature] as boolean;
};

// Helper function for signup forms
export const getTierBenefits = (tier: 'free' | 'paid'): string[] => {
  if (tier === 'free') {
    return [
      'QR Code Scanning',
      'Earn Loyalty Points',
      'Access Business Directory',
      'Basic Community Features'
    ];
  }
  
  return [
    'All Free Features',
    'Redeem Rewards',
    'Exclusive Deals Access',
    'Premium Support',
    'Mentorship Access',
    'Advanced Networking'
  ];
};
