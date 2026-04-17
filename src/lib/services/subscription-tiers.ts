export type SubscriptionTier = 'free' | 'business_pro' | 'business_pro_annual' | 'kayla_essentials' | 'kayla_essentials_annual' | 'kayla_starter' | 'kayla_starter_annual' | 'kayla_pro' | 'kayla_pro_annual' | 'kayla_pro_founders' | 'kayla_enterprise' | 'business_pro_kayla' | 'business_pro_kayla_annual' | 'enterprise' | 'kayla_ai';

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
  trialDays?: number;
  foundersLock?: boolean;
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

const ESSENTIALS_FEATURES: TierFeatures = {
  ...FREE_FEATURES,
  canVerifyBusiness: true,
  canAccessKaylaAI: true,
  maxQRCodes: 5,
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
  kayla_essentials: {
    displayName: 'Kayla AI Essentials',
    description: 'Perfect for businesses just getting started with AI',
    price: 19,
    interval: 'month',
    features: ESSENTIALS_FEATURES,
    trialDays: 30,
  },
  kayla_essentials_annual: {
    displayName: 'Kayla AI Essentials (Annual)',
    description: 'Perfect for businesses just getting started with AI',
    price: 190,
    interval: 'year',
    savingsText: 'Save $38/year',
    monthlyEquivalent: 15.83,
    features: ESSENTIALS_FEATURES,
    trialDays: 30,
  },
  business_pro: {
    displayName: 'Business Pro',
    description: 'Everything you need to grow — analytics, bookings, reviews & QR tools',
    price: 39,
    interval: 'month',
    features: PRO_FEATURES,
  },
  business_pro_annual: {
    displayName: 'Business Pro (Annual)',
    description: 'Everything you need to grow — analytics, bookings, reviews & QR tools',
    price: 390,
    interval: 'year',
    savingsText: 'Save $78/year',
    monthlyEquivalent: 32.50,
    features: PRO_FEATURES,
  },
  kayla_starter: {
    displayName: 'Kayla AI Starter',
    description: 'AI-powered records management & business tools',
    price: 79,
    interval: 'month',
    features: KAYLA_STARTER_FEATURES,
    trialDays: 30,
  },
  kayla_starter_annual: {
    displayName: 'Kayla AI Starter (Annual)',
    description: 'AI-powered records management & business tools',
    price: 790,
    interval: 'year',
    savingsText: 'Save $158/year',
    monthlyEquivalent: 65.83,
    features: KAYLA_STARTER_FEATURES,
    trialDays: 30,
  },
  kayla_pro: {
    displayName: 'Kayla AI Pro',
    description: 'Full suite of 28 AI-powered services — replaces ~$560/mo of single-purpose tools',
    price: 299,
    interval: 'month',
    popular: true,
    features: KAYLA_PRO_FEATURES,
    trialDays: 14,
  },
  kayla_pro_annual: {
    displayName: 'Kayla AI Pro (Annual)',
    description: 'Full suite of 28 AI-powered services — replaces ~$560/mo of single-purpose tools',
    price: 2990,
    interval: 'year',
    savingsText: 'Save $598/year',
    monthlyEquivalent: 249.17,
    popular: true,
    features: KAYLA_PRO_FEATURES,
    trialDays: 14,
  },
  kayla_pro_founders: {
    displayName: "Kayla AI Pro — Founders' Lock",
    description: "Limited to first 100 businesses. Locks $149/mo for life on the full Kayla AI Pro suite.",
    price: 149,
    interval: 'month',
    features: KAYLA_PRO_FEATURES,
    trialDays: 14,
    foundersLock: true,
  },
  kayla_enterprise: {
    displayName: 'Kayla AI Enterprise',
    description: 'Multi-location support, white-labeling, and advanced integrations',
    price: 899,
    interval: 'month',
    features: KAYLA_ENTERPRISE_FEATURES,
    trialDays: 14,
  },
  // Legacy tiers — kept for existing subscribers
  business_pro_kayla: {
    displayName: 'Business Pro + Kayla AI (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 28 services',
    price: 99,
    interval: 'month',
    features: KAYLA_PRO_FEATURES,
  },
  business_pro_kayla_annual: {
    displayName: 'Business Pro + Kayla AI Annual (Legacy)',
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 28 services',
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
    description: 'Legacy tier — please upgrade to Kayla AI Pro for 28 services',
    price: 100,
    interval: 'month',
    features: KAYLA_PRO_FEATURES,
  },
};

// New Kayla tier Stripe IDs (updated 2026-04-17 with new pricing)
export const KAYLA_STRIPE_TIERS = {
  kayla_essentials: {
    product_id: 'prod_UHjRWjYRKppK1O',
    price_id: 'price_1TJ9yKAsptTW1mCmr8SJRK2g',
  },
  kayla_essentials_annual: {
    product_id: 'prod_UHjRNumev7F1Ip',
    price_id: 'price_1TJ9yjAsptTW1mCmJ8pWHUqs',
  },
  // NEW $79/mo Starter (replaces $49 legacy)
  kayla_starter: {
    product_id: 'prod_UM3YIiuKpodj9o',
    price_id: 'price_1TNLRpAsptTW1mCm5QvipN9l',
  },
  // NEW $790/yr Starter
  kayla_starter_annual: {
    product_id: 'prod_UM3dmRBpKjDDrF',
    price_id: 'price_1TNLWEAsptTW1mCm2jha0NfY',
  },
  // NEW $299/mo Pro (replaces $149 legacy)
  kayla_pro: {
    product_id: 'prod_UM3ZojwbPG07MZ',
    price_id: 'price_1TNLSUAsptTW1mCmMW1G6Jfv',
  },
  // NEW $2,990/yr Pro
  kayla_pro_annual: {
    product_id: 'prod_UM3erfVz8sd2CU',
    price_id: 'price_1TNLXeAsptTW1mCmb6dsvL2y',
  },
  // Founders' Lock — first 100 businesses keep $149/mo Pro for life
  kayla_pro_founders: {
    product_id: 'prod_UFUecESxNwisIp',
    price_id: 'price_1TGzewAsptTW1mCmYKjYk0Fn',
  },
  // NEW $899/mo Enterprise (replaces $420 legacy)
  kayla_enterprise: {
    product_id: 'prod_UM3aCeIr8hQnr6',
    price_id: 'price_1TNLTCAsptTW1mCmVEccEd1D',
  },
  // NEW $50/user/mo Enterprise add-on
  kayla_enterprise_per_user: {
    product_id: 'prod_UM3b2qj1gpi2lB',
    price_id: 'price_1TNLU6AsptTW1mCmvlaqtQsZ',
  },
} as const;

// Legacy Stripe IDs — kept for existing subscribers
export const STRIPE_TIERS = {
  // NEW $39/mo Business Pro (replaces $29 legacy)
  business_pro: {
    product_id: 'prod_UM3YQnaUiayhXA',
    price_id: 'price_1TNLRBAsptTW1mCmCpwvkqrV',
  },
  // NEW $390/yr Business Pro
  business_pro_annual: {
    product_id: 'prod_UM3dcds61Gy8jk',
    price_id: 'price_1TNLVlAsptTW1mCmedqECEFO',
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

// Legacy Stripe IDs preserved for grandfathered subscribers
export const LEGACY_STRIPE_TIERS = {
  business_pro_29: {
    product_id: 'prod_UCivXlP1UaKvZE',
    price_id: 'price_1TEJTNAsptTW1mCmN77AMfHC',
  },
  business_pro_29_annual: {
    product_id: 'prod_UCiv54CPK1aUm9',
    price_id: 'price_1TEJU3AsptTW1mCmz4NCorgC',
  },
  kayla_starter_49: {
    product_id: 'prod_UFUdUF34VKQbzz',
    price_id: 'price_1TGzeOAsptTW1mCmJCGRE0mL',
  },
  kayla_starter_49_annual: {
    product_id: 'prod_UFUfwy9PZaHpDW',
    price_id: 'price_1TGzg6AsptTW1mCmbkF4gffD',
  },
  kayla_pro_149_annual: {
    product_id: 'prod_UFUf1uG3DHfqcT',
    price_id: 'price_1TGzgRAsptTW1mCmloHSfeKB',
  },
  kayla_enterprise_420: {
    product_id: 'prod_UIUgpp70mjqcMg',
    price_id: 'price_1TJtguAsptTW1mCmrS1wWoN7',
  },
} as const;

// Legacy — keep for existing Kayla-only subscribers
export const KAYLA_AI_STRIPE = {
  product_id: 'prod_UByEsslXcmz8Tx',
  price_id: 'price_1TDaHyAsptTW1mCm2F8e7NmE',
} as const;

// Legacy Enterprise Stripe IDs — kept for existing $399/mo subscribers
export const KAYLA_ENTERPRISE_LEGACY_STRIPE = {
  product_id: 'prod_UFUePOjWHMDlbC',
  price_id: 'price_1TGzfdAsptTW1mCms0S1EJ4d',
} as const;

// Sponsorship Stripe IDs
export const SPONSORSHIP_STRIPE_TIERS = {
  founding: {
    product_id: 'prod_UM3bHpO1zG5jta',
    price_id: 'price_1TNLUlAsptTW1mCm7rLwOuCq',
    monthly_amount: 1750,
  },
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
  if (features.canAccessRecordsManagement) benefits.push('Records Management');
  if (features.canAccessKaylaAI) benefits.push('Kayla AI Employee');
  if (features.canAccessMentorship) benefits.push('Mentorship Access');
  if (features.canAccessPremiumSupport) benefits.push('Premium Support');
  
  return benefits;
};
