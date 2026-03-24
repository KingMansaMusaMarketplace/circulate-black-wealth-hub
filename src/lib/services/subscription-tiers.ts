export type SubscriptionTier = 'free' | 'business_pro' | 'business_pro_annual' | 'business_pro_kayla' | 'business_pro_kayla_annual' | 'enterprise' | 'kayla_ai';

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
  canAccessKaylaAI: boolean;
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

const FREE_FEATURES: TierFeatures = {
  canScanQR: true,
  canEarnPoints: true,
  canRedeemRewards: true,
  canAccessExclusiveDeals: true,
  canCreateBusiness: true,
  canVerifyBusiness: false,
  canAccessAnalytics: false,
  canCreateEvents: false,
  canAccessPremiumSupport: false,
  canAccessMentorship: true,
  canAccessNetworking: true,
  canAccessKaylaAI: false,
  maxQRCodes: 0,
};

const PRO_FEATURES: TierFeatures = {
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
  canAccessKaylaAI: false,
  maxQRCodes: 25,
};

const KAYLA_FEATURES: TierFeatures = {
  ...PRO_FEATURES,
  canAccessKaylaAI: true,
  maxQRCodes: -1,
};

export const subscriptionTiers: Record<SubscriptionTier, TierInfo> = {
  free: {
    displayName: 'Free Directory Listing',
    description: 'Get discovered — list your business for free, forever',
    price: 0,
    interval: 'month',
    features: FREE_FEATURES,
  },
  business_pro: {
    displayName: 'Business Pro',
    description: 'Everything you need to grow — analytics, bookings, reviews & QR tools',
    price: 29,
    interval: 'month',
    features: PRO_FEATURES,
  },
  business_pro_annual: {
    displayName: 'Business Pro (Annual)',
    description: 'Everything you need to grow — analytics, bookings, reviews & QR tools',
    price: 290,
    interval: 'year',
    savingsText: 'Save $58/year',
    monthlyEquivalent: 24.17,
    features: PRO_FEATURES,
  },
  business_pro_kayla: {
    displayName: 'Business Pro + Kayla AI',
    description: 'Your autonomous AI employee — reviews, B2B matching, tax prep, legal & more on autopilot',
    price: 99,
    interval: 'month',
    popular: true,
    features: KAYLA_FEATURES,
  },
  business_pro_kayla_annual: {
    displayName: 'Business Pro + Kayla AI (Annual)',
    description: 'Your autonomous AI employee — reviews, B2B matching, tax prep, legal & more on autopilot',
    price: 990,
    interval: 'year',
    savingsText: 'Save $198/year',
    monthlyEquivalent: 82.50,
    popular: true,
    features: KAYLA_FEATURES,
  },
  enterprise: {
    displayName: 'Enterprise',
    description: 'Custom solutions for large organizations and franchises',
    price: 299,
    interval: 'month',
    features: {
      ...KAYLA_FEATURES,
      maxQRCodes: -1,
    },
  },
  // Legacy tier — kept for existing subscribers
  kayla_ai: {
    displayName: 'Kayla AI Employee',
    description: 'Your autonomous AI employee — reviews, B2B matching, churn prediction & content on autopilot',
    price: 100,
    interval: 'month',
    features: KAYLA_FEATURES,
  },
};

// Stripe price/product IDs
export const STRIPE_TIERS = {
  business_pro: {
    product_id: 'prod_UCivXlP1UaKvZE',
    price_id: 'price_1TEJTNAsptTW1mCmN77AMfHC',
  },
  business_pro_annual: {
    product_id: 'prod_UCiv54CPK1aUm9',
    price_id: 'price_1TEJU3AsptTW1mCmz4NCorgC',
  },
  business_pro_kayla: {
    product_id: 'prod_UCiwV7cW2RoHtA',
    price_id: 'price_1TEJUuAsptTW1mCmeJ3mPp06',
  },
  business_pro_kayla_annual: {
    product_id: 'prod_UCixzeMjE209ho',
    price_id: 'price_1TEJViAsptTW1mCmNcCOjwWz',
  },
} as const;

// Legacy — keep for existing Kayla-only subscribers
export const KAYLA_AI_STRIPE = {
  product_id: 'prod_UByEsslXcmz8Tx',
  price_id: 'price_1TDaHyAsptTW1mCm2F8e7NmE',
} as const;

export const getTierDisplayName = (tier: SubscriptionTier): string => {
  return subscriptionTiers[tier]?.displayName || 'Free Directory Listing';
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
  if (features.canAccessKaylaAI) benefits.push('Kayla AI Employee');
  if (features.canAccessMentorship) benefits.push('Mentorship Access');
  if (features.canAccessPremiumSupport) benefits.push('Premium Support');
  
  return benefits;
};
