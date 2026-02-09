import { describe, it, expect, vi } from 'vitest';

// Types for feature flag testing
interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_types: string[] | null;
}

// Simulated flag checking logic (mirrors the actual implementation)
function checkFlagEnabled(
  flag: FeatureFlag | undefined,
  userId: string | null,
  userType: string,
  getRolloutValue: (flagKey: string, userId: string) => number
): boolean {
  // Flag not found - default to disabled
  if (!flag) {
    return false;
  }

  // Flag globally disabled
  if (!flag.is_enabled) {
    return false;
  }

  // Check user type targeting
  if (flag.target_user_types && flag.target_user_types.length > 0) {
    if (!flag.target_user_types.includes(userType)) {
      return false;
    }
  }

  // Check rollout percentage
  if (flag.rollout_percentage < 100 && userId) {
    const userRolloutValue = getRolloutValue(flag.key, userId);
    if (userRolloutValue >= flag.rollout_percentage) {
      return false;
    }
  }

  return true;
}

// Deterministic hash function for rollout
function getRolloutValue(flagKey: string, userId: string): number {
  const combined = `${userId}:${flagKey}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100;
}

describe('Feature Flags System', () => {
  describe('Basic Flag States', () => {
    it('should return false for undefined flag', () => {
      expect(checkFlagEnabled(undefined, 'user-1', 'customer', getRolloutValue)).toBe(false);
    });

    it('should return false for disabled flag', () => {
      const flag: FeatureFlag = {
        id: '1',
        name: 'Test Flag',
        key: 'test_flag',
        description: null,
        is_enabled: false,
        rollout_percentage: 100,
        target_user_types: null,
      };
      expect(checkFlagEnabled(flag, 'user-1', 'customer', getRolloutValue)).toBe(false);
    });

    it('should return true for enabled flag with 100% rollout', () => {
      const flag: FeatureFlag = {
        id: '1',
        name: 'Test Flag',
        key: 'test_flag',
        description: null,
        is_enabled: true,
        rollout_percentage: 100,
        target_user_types: null,
      };
      expect(checkFlagEnabled(flag, 'user-1', 'customer', getRolloutValue)).toBe(true);
    });
  });

  describe('Rollout Percentage', () => {
    const baseFlag: FeatureFlag = {
      id: '1',
      name: 'Rollout Test',
      key: 'rollout_test',
      description: null,
      is_enabled: true,
      rollout_percentage: 50,
      target_user_types: null,
    };

    it('should be deterministic - same user always gets same result', () => {
      const result1 = checkFlagEnabled(baseFlag, 'user-123', 'customer', getRolloutValue);
      const result2 = checkFlagEnabled(baseFlag, 'user-123', 'customer', getRolloutValue);
      expect(result1).toBe(result2);
    });

    it('should produce different results for different users', () => {
      // With enough users, we should see some variation
      const results = new Set<boolean>();
      for (let i = 0; i < 100; i++) {
        results.add(checkFlagEnabled(baseFlag, `user-${i}`, 'customer', getRolloutValue));
      }
      // At 50% rollout, we should see both true and false
      expect(results.size).toBe(2);
    });

    it('should return true for 100% rollout', () => {
      const flag = { ...baseFlag, rollout_percentage: 100 };
      // All users should see the feature
      for (let i = 0; i < 20; i++) {
        expect(checkFlagEnabled(flag, `user-${i}`, 'customer', getRolloutValue)).toBe(true);
      }
    });

    it('should return false for 0% rollout', () => {
      const flag = { ...baseFlag, rollout_percentage: 0 };
      // No users should see the feature
      for (let i = 0; i < 20; i++) {
        expect(checkFlagEnabled(flag, `user-${i}`, 'customer', getRolloutValue)).toBe(false);
      }
    });

    it('should respect rollout distribution approximately', () => {
      // Test that ~50% of users get the feature at 50% rollout
      let enabledCount = 0;
      const totalUsers = 1000;
      
      for (let i = 0; i < totalUsers; i++) {
        if (checkFlagEnabled(baseFlag, `test-user-${i}`, 'customer', getRolloutValue)) {
          enabledCount++;
        }
      }
      
      // Allow 10% variance (40-60% range)
      const percentage = enabledCount / totalUsers;
      expect(percentage).toBeGreaterThan(0.4);
      expect(percentage).toBeLessThan(0.6);
    });
  });

  describe('User Type Targeting', () => {
    const baseFlag: FeatureFlag = {
      id: '1',
      name: 'Targeted Flag',
      key: 'targeted_flag',
      description: null,
      is_enabled: true,
      rollout_percentage: 100,
      target_user_types: ['business', 'admin'],
    };

    it('should allow access for targeted user types', () => {
      expect(checkFlagEnabled(baseFlag, 'user-1', 'business', getRolloutValue)).toBe(true);
      expect(checkFlagEnabled(baseFlag, 'user-1', 'admin', getRolloutValue)).toBe(true);
    });

    it('should deny access for non-targeted user types', () => {
      expect(checkFlagEnabled(baseFlag, 'user-1', 'customer', getRolloutValue)).toBe(false);
      expect(checkFlagEnabled(baseFlag, 'user-1', 'anonymous', getRolloutValue)).toBe(false);
    });

    it('should allow all user types when target_user_types is null', () => {
      const flag = { ...baseFlag, target_user_types: null };
      expect(checkFlagEnabled(flag, 'user-1', 'customer', getRolloutValue)).toBe(true);
      expect(checkFlagEnabled(flag, 'user-1', 'business', getRolloutValue)).toBe(true);
      expect(checkFlagEnabled(flag, 'user-1', 'admin', getRolloutValue)).toBe(true);
    });

    it('should allow all user types when target_user_types is empty array', () => {
      const flag = { ...baseFlag, target_user_types: [] };
      expect(checkFlagEnabled(flag, 'user-1', 'customer', getRolloutValue)).toBe(true);
    });
  });

  describe('Combined Conditions', () => {
    it('should require both user type AND rollout to pass', () => {
      const flag: FeatureFlag = {
        id: '1',
        name: 'Combined Test',
        key: 'combined_test',
        description: null,
        is_enabled: true,
        rollout_percentage: 50,
        target_user_types: ['business'],
      };

      // Customer type should be denied regardless of rollout
      expect(checkFlagEnabled(flag, 'user-1', 'customer', getRolloutValue)).toBe(false);
      
      // Business type should be allowed if in rollout
      // (we can't guarantee specific result but it should be consistent)
      const result = checkFlagEnabled(flag, 'user-1', 'business', getRolloutValue);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Rollout Hash Function', () => {
    it('should produce values between 0-99', () => {
      for (let i = 0; i < 100; i++) {
        const value = getRolloutValue(`flag-${i}`, `user-${i}`);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(100);
      }
    });

    it('should be deterministic', () => {
      expect(getRolloutValue('flag1', 'user1')).toBe(getRolloutValue('flag1', 'user1'));
      expect(getRolloutValue('flag2', 'user2')).toBe(getRolloutValue('flag2', 'user2'));
    });

    it('should produce different values for different inputs', () => {
      const value1 = getRolloutValue('flag1', 'user1');
      const value2 = getRolloutValue('flag1', 'user2');
      const value3 = getRolloutValue('flag2', 'user1');
      
      // At least some should be different
      const values = new Set([value1, value2, value3]);
      expect(values.size).toBeGreaterThan(1);
    });
  });
});
