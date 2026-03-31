export type SubscriptionTier = 'free' | 'business_pro' | 'business_pro_annual' | 'kayla_starter' | 'kayla_starter_annual' | 'kayla_pro' | 'kayla_pro_annual' | 'kayla_enterprise' | 'business_pro_kayla' | 'business_pro_kayla_annual' | 'enterprise' | 'kayla_ai';

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
  canAccessRecordsManagement: boolean;
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
  onboardingFee?: number;
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
  canAccessRecordsManagement: false,
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
  canAccessRecordsManagement: false,
  maxQRCodes: 25,
};

const KAYLA_STARTER_FEATURES: TierFeatures = {
  ...PRO_FEATURES,
  canAccessKaylaAI: true,
  canAccessRecordsManagement: true,
  maxQRCodes: 25,
};

const KAYLA_PRO_FEATURES: TierFeatures = {
  ...PRO_FEATURES,
  canAccessKaylaAI: true,
  canAccessRecordsManagement: true,
  maxQRCodes: -1,
};

const KAYLA_ENTERPRISE_FEATURES: TierFeatures = {
  ...KAYLA_PRO_FEATURES,
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
  kayla_starter: {
    displayName: 'Kayla AI Starter',
    description: 'Records Management only — document vault, OCR extraction, Ask Kayla chat & expiration alerts',
    price: 49,
    interval: 'month',
    features: KAYLA_STARTER_FEATURES,
  },
  kayla_starter_annual: {
    displayName: 'Kayla AI Starter (Annual)',
    description: 'Records Management only — document vault, OCR extraction, Ask Kayla chat & expiration alerts',
    price: 490,
    interval: 'year',
    savingsText: 'Save $98/year',
    monthlyEquivalent: 40.83,
    features: KAYLA_STARTER_FEATURES,
  },
  kayla_pro: {
    displayName: 'Kayla AI Pro',
    description: 'All 23+ Kayla services — replaces $1,650–$5,750/month in human labor starting at $149/month',
    price: 149,
    interval: 'month',
    popular: true,
    features: KAYLA_PRO_FEATURES,
    onboardingFee: 149,
  },
  kayla_pro_annual: {
    displayName: 'Kayla AI Pro (Annual)',
    description: 'All 23+ Kayla services — replaces $1,650–$5,750/month in human labor, a 10–38x value multiplier',
    price: 1490,
    interval: 'year',
    savingsText: 'Save $298/year',
    monthlyEquivalent: 124.17,
    popular: true,
    features: KAYLA_PRO_FEATURES,
    onboardingFee: 149,
  },
  kayla_enterprise: {
    displayName: 'Kayla AI Enterprise',
    description: 'Multi-location support, white-label Kayla branding, HIPAA BAA, priority support & API access',
    price: 399,
    interval: 'month',
    features: KAYLA_ENTERPRISE_FEATURES,
    onboardingFee: 149,
  },
  // Legacy tiers — kept for existing subscribers
  business_pro_kayla: {
    displayName: 'Business Pro + Kayla AI (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 23+ services',
    price: 99,
    interval: 'month',
    features: KAYLA_PRO_FEATURES,
  },
  business_pro_kayla_annual: {
    displayName: 'Business Pro + Kayla AI Annual (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 23+ services',
    price: 990,
    interval: 'year',
    savingsText: 'Save $198/year',
    monthlyEquivalent: 82.50,
    features: KAYLA_PRO_FEATURES,
  },
  enterprise: {
    displayName: 'Enterprise (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Enterprise',
    price: 299,
    interval: 'month',
    features: KAYLA_ENTERPRISE_FEATURES,
  },
  kayla_ai: {
    displayName: 'Kayla AI Employee (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 23+ services',
    price: 100,
    interval: 'month',
    features: KAYLA_PRO_FEATURES,
  },
};

// New Kayla tier Stripe IDs
export const KAYLA_STRIPE_TIERS = {
  kayla_starter: {
    product_id: 'prod_UFUdUF34VKQbzz',
    price_id: 'price_1TGzeOAsptTW1mCmJCGRE0mL',
  },
  kayla_starter_annual: {
    product_id: 'prod_UFUfwy9PZaHpDW',
    price_id: 'price_1TGzg6AsptTW1mCmbkF4gffD',
  },
  kayla_pro: {
    product_id: 'prod_UFUecESxNwisIp',
    price_id: 'price_1TGzewAsptTW1mCmYKjYk0Fn',
  },
  kayla_pro_annual: {
    product_id: 'prod_UFUf1uG3DHfqcT',
    price_id: 'price_1TGzgRAsptTW1mCmloHSfeKB',
  },
  kayla_enterprise: {
    product_id: 'prod_UFUePOjWHMDlbC',
    price_id: 'price_1TGzfdAsptTW1mCms0S1EJ4d',
  },
} as const;

// Legacy Stripe IDs — kept for existing subscribers
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

// One-time onboarding fee (Pro and Enterprise only)
export const KAYLA_ONBOARDING_FEE = 149;

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
  if (features.canAccessRecordsManagement) benefits.push('Records Management');
  if (features.canAccessKaylaAI) benefits.push('Kayla AI Employee');
  if (features.canAccessMentorship) benefits.push('Mentorship Access');
  if (features.canAccessPremiumSupport) benefits.push('Premium Support');
  
  return benefits;
};
