import { describe, it, expect } from 'vitest';
import { 
  calculateLoyaltyPoints, 
  isEligibleForReward, 
  calculateRewardTier, 
  calculateDiscountFromPoints 
} from '@/lib/api/loyalty-api-utils';

describe('Loyalty System', () => {
  describe('calculateLoyaltyPoints', () => {
    it('should calculate points correctly for whole dollar amounts', () => {
      expect(calculateLoyaltyPoints(100)).toBe(100);
      expect(calculateLoyaltyPoints(50)).toBe(50);
      expect(calculateLoyaltyPoints(1)).toBe(1);
    });

    it('should round to nearest point for decimal amounts', () => {
      expect(calculateLoyaltyPoints(10.5)).toBe(11);
      expect(calculateLoyaltyPoints(10.4)).toBe(10);
      expect(calculateLoyaltyPoints(10.49)).toBe(10);
      expect(calculateLoyaltyPoints(10.51)).toBe(11);
    });

    it('should handle zero amount', () => {
      expect(calculateLoyaltyPoints(0)).toBe(0);
    });

    it('should handle large amounts', () => {
      expect(calculateLoyaltyPoints(10000)).toBe(10000);
      expect(calculateLoyaltyPoints(999999.99)).toBe(1000000);
    });
  });

  describe('isEligibleForReward', () => {
    it('should return true when customer has enough points', () => {
      expect(isEligibleForReward(100, 50)).toBe(true);
      expect(isEligibleForReward(100, 100)).toBe(true);
    });

    it('should return false when customer has insufficient points', () => {
      expect(isEligibleForReward(50, 100)).toBe(false);
      expect(isEligibleForReward(0, 1)).toBe(false);
    });

    it('should handle zero cost rewards', () => {
      expect(isEligibleForReward(0, 0)).toBe(true);
      expect(isEligibleForReward(100, 0)).toBe(true);
    });
  });

  describe('calculateRewardTier', () => {
    it('should return bronze tier for 0-99 points', () => {
      expect(calculateRewardTier(0)).toEqual({
        tier: 'bronze',
        nextTier: 'silver',
        pointsToNextTier: 100
      });
      expect(calculateRewardTier(50)).toEqual({
        tier: 'bronze',
        nextTier: 'silver',
        pointsToNextTier: 50
      });
      expect(calculateRewardTier(99)).toEqual({
        tier: 'bronze',
        nextTier: 'silver',
        pointsToNextTier: 1
      });
    });

    it('should return silver tier for 100-499 points', () => {
      expect(calculateRewardTier(100)).toEqual({
        tier: 'silver',
        nextTier: 'gold',
        pointsToNextTier: 400
      });
      expect(calculateRewardTier(250)).toEqual({
        tier: 'silver',
        nextTier: 'gold',
        pointsToNextTier: 250
      });
      expect(calculateRewardTier(499)).toEqual({
        tier: 'silver',
        nextTier: 'gold',
        pointsToNextTier: 1
      });
    });

    it('should return gold tier for 500-999 points', () => {
      expect(calculateRewardTier(500)).toEqual({
        tier: 'gold',
        nextTier: 'platinum',
        pointsToNextTier: 500
      });
      expect(calculateRewardTier(750)).toEqual({
        tier: 'gold',
        nextTier: 'platinum',
        pointsToNextTier: 250
      });
      expect(calculateRewardTier(999)).toEqual({
        tier: 'gold',
        nextTier: 'platinum',
        pointsToNextTier: 1
      });
    });

    it('should return platinum tier for 1000+ points', () => {
      expect(calculateRewardTier(1000)).toEqual({ tier: 'platinum' });
      expect(calculateRewardTier(5000)).toEqual({ tier: 'platinum' });
      expect(calculateRewardTier(100000)).toEqual({ tier: 'platinum' });
    });

    it('should handle tier boundary cases correctly', () => {
      // Exact boundary
      expect(calculateRewardTier(100).tier).toBe('silver');
      expect(calculateRewardTier(500).tier).toBe('gold');
      expect(calculateRewardTier(1000).tier).toBe('platinum');
      
      // Just below boundary
      expect(calculateRewardTier(99).tier).toBe('bronze');
      expect(calculateRewardTier(499).tier).toBe('silver');
      expect(calculateRewardTier(999).tier).toBe('gold');
    });
  });

  describe('calculateDiscountFromPoints', () => {
    it('should calculate discount with default conversion rate ($0.10/point)', () => {
      expect(calculateDiscountFromPoints(100)).toBe(10);
      expect(calculateDiscountFromPoints(50)).toBe(5);
      expect(calculateDiscountFromPoints(1)).toBe(0.1);
    });

    it('should calculate discount with custom conversion rate', () => {
      expect(calculateDiscountFromPoints(100, 0.05)).toBe(5); // $0.05/point
      expect(calculateDiscountFromPoints(100, 0.20)).toBe(20); // $0.20/point
      expect(calculateDiscountFromPoints(100, 1)).toBe(100); // $1/point
    });

    it('should handle zero points', () => {
      expect(calculateDiscountFromPoints(0)).toBe(0);
      expect(calculateDiscountFromPoints(0, 0.20)).toBe(0);
    });

    it('should handle large point values', () => {
      expect(calculateDiscountFromPoints(10000)).toBe(1000);
      expect(calculateDiscountFromPoints(10000, 0.01)).toBe(100);
    });
  });
});
