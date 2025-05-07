
// Helper functions for the loyalty system

// Calculate loyalty points based on transaction amount
export const calculateLoyaltyPoints = (amount: number): number => {
  // Basic formula: $1 = 1 point, rounded to nearest point
  return Math.round(amount);
};

// Determine if a customer is eligible for a specific reward
export const isEligibleForReward = (
  customerPoints: number, 
  rewardPointsCost: number
): boolean => {
  return customerPoints >= rewardPointsCost;
};

// Calculate reward tier based on customer's accumulated points
export const calculateRewardTier = (totalPoints: number): {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTier?: string;
  pointsToNextTier?: number;
} => {
  if (totalPoints < 100) {
    return { 
      tier: 'bronze',
      nextTier: 'silver',
      pointsToNextTier: 100 - totalPoints
    };
  } else if (totalPoints < 500) {
    return { 
      tier: 'silver',
      nextTier: 'gold',
      pointsToNextTier: 500 - totalPoints
    };
  } else if (totalPoints < 1000) {
    return { 
      tier: 'gold',
      nextTier: 'platinum',
      pointsToNextTier: 1000 - totalPoints
    };
  } else {
    return { tier: 'platinum' };
  }
};

// Calculate discount amount based on points redeemed
export const calculateDiscountFromPoints = (
  points: number, 
  conversionRate = 0.1 // $0.10 per point
): number => {
  return points * conversionRate;
};
