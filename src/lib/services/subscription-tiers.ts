
export type SubscriptionTier = 'free' | 'paid';

export interface FeatureAccess {
  canScanQR: boolean;
  canEarnPoints: boolean;
  canRedeemRewards: boolean;
  canAccessExclusiveDeals: boolean;
  hasFullDirectoryAccess: boolean;
}

export const getFeatureAccess = (tier: SubscriptionTier): FeatureAccess => {
  switch (tier) {
    case 'free':
      return {
        canScanQR: false,
        canEarnPoints: false,
        canRedeemRewards: false,
        canAccessExclusiveDeals: false,
        hasFullDirectoryAccess: true, // Basic directory access
      };
    case 'paid':
      return {
        canScanQR: true,
        canEarnPoints: true,
        canRedeemRewards: true,
        canAccessExclusiveDeals: true,
        hasFullDirectoryAccess: true,
      };
    default:
      return {
        canScanQR: false,
        canEarnPoints: false,
        canRedeemRewards: false,
        canAccessExclusiveDeals: false,
        hasFullDirectoryAccess: true,
      };
  }
};

export const getTierDisplayName = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'free':
      return 'Free Member';
    case 'paid':
      return 'Premium Member';
    default:
      return 'Member';
  }
};

export const getTierBenefits = (tier: SubscriptionTier): string[] => {
  switch (tier) {
    case 'free':
      return [
        'Browse Black-owned businesses',
        'View business profiles and contact info',
        'Search and filter directory',
        'Access basic business information'
      ];
    case 'paid':
      return [
        'All free features',
        'Scan QR codes for instant discounts',
        'Earn loyalty points with every purchase',
        'Redeem points for exclusive rewards',
        'Access member-only deals',
        'Priority customer support'
      ];
    default:
      return [];
  }
};
