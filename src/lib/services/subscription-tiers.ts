export type SubscriptionTier = 'free' | 'business_starter' | 'business_starter_annual' | 'business' | 'business_annual' | 'business_multi_location' | 'business_multi_location_annual' | 'enterprise';

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
  savingsText?: string;
  monthlyEquivalent?: number;
}

export const subscriptionTiers: Record<SubscriptionTier, TierInfo> = {
  free: {
    displayName: 'Community Member',
    description: '100% Free Forever - All Features Included',
    price: 0,
    interval: 'month',
    features: {
      canScanQR: true,
      canEarnPoints: true,
      canRedeemRewards: true,
      canAccessExclusiveDeals: true,
      canCreateBusiness: false,
      canVerifyBusiness: false,
      canAccessAnalytics: false,
      canCreateEvents: false,
      canAccessPremiumSupport: false,
      canAccessMentorship: true,
      canAccessNetworking: true,
      maxQRCodes: 0
    }
  },
  business_starter: {
    displayName: 'Starter Business',
    description: 'Perfect for solo entrepreneurs and new businesses',
    price: 39,
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
      maxQRCodes: 5
    }
  },
  business_starter_annual: {
    displayName: 'Starter Business (Annual)',
    description: 'Perfect for solo entrepreneurs and new businesses',
    price: 390,
    interval: 'year',
    savingsText: 'Save $78/year',
    monthlyEquivalent: 32.50,
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
      maxQRCodes: 5
    }
  },
  business: {
    displayName: 'Professional Business',
    description: 'Most popular for established businesses',
    price: 79,
    interval: 'month',
    popular: true,
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
      maxQRCodes: 25
    }
  },
  business_annual: {
    displayName: 'Professional Business (Annual)',
    description: 'Most popular for established businesses',
    price: 790,
    interval: 'year',
    savingsText: 'Save $158/year',
    monthlyEquivalent: 65.83,
    popular: true,
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
      maxQRCodes: 25
    }
  },
  business_multi_location: {
    displayName: 'Multi-Location Business',
    description: 'Perfect for franchises and chains',
    price: 149,
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
      maxQRCodes: -1
    }
  },
  business_multi_location_annual: {
    displayName: 'Multi-Location Business (Annual)',
    description: 'Perfect for franchises and chains',
    price: 1490,
    interval: 'year',
    savingsText: 'Save $298/year',
    monthlyEquivalent: 124.17,
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
      maxQRCodes: -1
    }
  },
  enterprise: {
    displayName: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 299,
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
      maxQRCodes: -1
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
