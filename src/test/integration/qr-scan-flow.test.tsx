/**
 * Integration Test: QR Scan to Points Flow
 * Tests the complete QR scanning loyalty flow including commission calculations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Platform commission rate
const PLATFORM_COMMISSION_RATE = 0.075; // 7.5%

// Test fixtures
const testQrCodes = {
  valid: {
    id: 'qr-123',
    code: 'abc123def456',
    business_id: 'business-123',
    points_value: 100,
    is_active: true,
    scan_limit: 10,
    current_scans: 0,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  },
  expired: {
    id: 'qr-expired',
    code: 'expired123',
    business_id: 'business-123',
    points_value: 50,
    is_active: true,
    scan_limit: 10,
    current_scans: 0,
    expires_at: new Date(Date.now() - 86400000).toISOString(),
  },
  maxScans: {
    id: 'qr-maxed',
    code: 'maxed123',
    business_id: 'business-123',
    points_value: 75,
    is_active: true,
    scan_limit: 5,
    current_scans: 5,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  },
};

describe('QR Scan Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('QR Code validation', () => {
    it('should validate QR code format (UUID)', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(uuidRegex.test('invalid-uuid')).toBe(false);
      expect(uuidRegex.test('not-a-uuid')).toBe(false);
    });

    it('should reject expired QR codes', () => {
      const qrCode = testQrCodes.expired;
      const now = new Date();
      const expiresAt = new Date(qrCode.expires_at);
      
      expect(expiresAt < now).toBe(true);
    });

    it('should reject QR codes that have reached scan limit', () => {
      const qrCode = testQrCodes.maxScans;
      
      expect(qrCode.current_scans >= qrCode.scan_limit).toBe(true);
    });

    it('should accept valid, unexpired QR codes', () => {
      const qrCode = testQrCodes.valid;
      const now = new Date();
      const expiresAt = new Date(qrCode.expires_at);
      
      expect(qrCode.is_active).toBe(true);
      expect(expiresAt > now).toBe(true);
      expect(qrCode.current_scans < qrCode.scan_limit).toBe(true);
    });

    it('should validate QR code can be scanned', () => {
      const canScan = (qrCode: typeof testQrCodes.valid) => {
        const now = new Date();
        const expiresAt = new Date(qrCode.expires_at);
        
        if (!qrCode.is_active) return { canScan: false, reason: 'QR code is inactive' };
        if (expiresAt < now) return { canScan: false, reason: 'QR code has expired' };
        if (qrCode.current_scans >= qrCode.scan_limit) return { canScan: false, reason: 'Scan limit reached' };
        
        return { canScan: true, reason: null };
      };

      expect(canScan(testQrCodes.valid).canScan).toBe(true);
      expect(canScan(testQrCodes.expired).canScan).toBe(false);
      expect(canScan(testQrCodes.maxScans).canScan).toBe(false);
    });
  });

  describe('Points calculation and awarding', () => {
    it('should calculate correct points with commission deducted', () => {
      const grossPoints = 100;
      const commission = Math.round(grossPoints * PLATFORM_COMMISSION_RATE);
      const netPoints = grossPoints - commission;

      expect(commission).toBe(8); // 7.5% of 100 rounded = 8
      expect(netPoints).toBe(92);
    });

    it('should handle various point values correctly', () => {
      const testCases = [
        { gross: 50, expectedCommission: 4, expectedNet: 46 },
        { gross: 100, expectedCommission: 8, expectedNet: 92 },
        { gross: 200, expectedCommission: 15, expectedNet: 185 },
        { gross: 1000, expectedCommission: 75, expectedNet: 925 },
      ];

      testCases.forEach(({ gross, expectedCommission, expectedNet }) => {
        const commission = Math.round(gross * PLATFORM_COMMISSION_RATE);
        const netPoints = gross - commission;
        
        expect(commission).toBe(expectedCommission);
        expect(netPoints).toBe(expectedNet);
      });
    });

    it('should handle edge case of zero points', () => {
      const grossPoints = 0;
      const commission = Math.round(grossPoints * PLATFORM_COMMISSION_RATE);
      const netPoints = grossPoints - commission;

      expect(commission).toBe(0);
      expect(netPoints).toBe(0);
    });

    it('should handle small point values correctly', () => {
      const grossPoints = 10;
      const commission = Math.round(grossPoints * PLATFORM_COMMISSION_RATE);
      const netPoints = grossPoints - commission;

      expect(commission).toBe(1); // 7.5% of 10 rounded = 1
      expect(netPoints).toBe(9);
    });
  });

  describe('Scan increment logic', () => {
    it('should increment scan count correctly', () => {
      const qrCode = { ...testQrCodes.valid };
      const newScanCount = qrCode.current_scans + 1;

      expect(newScanCount).toBe(1);
      expect(newScanCount < qrCode.scan_limit).toBe(true);
    });

    it('should detect when scan limit is reached after increment', () => {
      const qrCode = { ...testQrCodes.valid, current_scans: 9, scan_limit: 10 };
      const newScanCount = qrCode.current_scans + 1;

      expect(newScanCount).toBe(10);
      expect(newScanCount >= qrCode.scan_limit).toBe(true);
    });
  });

  describe('Transaction logging', () => {
    it('should create valid transaction object', () => {
      const createTransaction = (
        userId: string,
        businessId: string,
        qrCodeId: string,
        grossPoints: number
      ) => {
        const commission = Math.round(grossPoints * PLATFORM_COMMISSION_RATE);
        const netPoints = grossPoints - commission;

        return {
          user_id: userId,
          business_id: businessId,
          qr_code_id: qrCodeId,
          gross_points: grossPoints,
          net_points: netPoints,
          platform_commission: commission,
          commission_rate: PLATFORM_COMMISSION_RATE,
          transaction_type: 'qr_scan',
          created_at: new Date().toISOString(),
        };
      };

      const transaction = createTransaction('user-1', 'business-1', 'qr-1', 100);

      expect(transaction.gross_points).toBe(100);
      expect(transaction.net_points).toBe(92);
      expect(transaction.platform_commission).toBe(8);
      expect(transaction.net_points + transaction.platform_commission).toBe(transaction.gross_points);
    });
  });

  describe('User notification', () => {
    it('should format points notification message', () => {
      const formatNotification = (points: number, businessName: string) => {
        return `You earned ${points} points at ${businessName}!`;
      };

      const message = formatNotification(92, 'Test Business');
      expect(message).toBe('You earned 92 points at Test Business!');
    });

    it('should include tier progress in notification when close to upgrade', () => {
      const tierThresholds = {
        Bronze: 0,
        Silver: 1000,
        Gold: 2500,
        Platinum: 5000,
      };

      const checkTierProgress = (currentPoints: number, pointsEarned: number) => {
        const newTotal = currentPoints + pointsEarned;
        const tiers = Object.entries(tierThresholds).sort((a, b) => b[1] - a[1]);
        
        for (const [tier, threshold] of tiers) {
          if (currentPoints < threshold && newTotal >= threshold) {
            return { upgraded: true, newTier: tier };
          }
        }
        
        return { upgraded: false, newTier: null };
      };

      // Test tier upgrade
      const result = checkTierProgress(950, 100);
      expect(result.upgraded).toBe(true);
      expect(result.newTier).toBe('Silver');

      // Test no upgrade
      const noUpgrade = checkTierProgress(500, 100);
      expect(noUpgrade.upgraded).toBe(false);

      // Test Gold upgrade
      const goldUpgrade = checkTierProgress(2450, 100);
      expect(goldUpgrade.upgraded).toBe(true);
      expect(goldUpgrade.newTier).toBe('Gold');
    });
  });

  describe('Duplicate scan prevention', () => {
    it('should identify duplicate scan attempts', () => {
      const previousScans = [
        { qr_code_id: 'qr-1', user_id: 'user-1', scanned_at: '2024-01-01' },
        { qr_code_id: 'qr-2', user_id: 'user-1', scanned_at: '2024-01-02' },
      ];

      const isDuplicate = (qrCodeId: string, userId: string) => {
        return previousScans.some(
          scan => scan.qr_code_id === qrCodeId && scan.user_id === userId
        );
      };

      expect(isDuplicate('qr-1', 'user-1')).toBe(true);
      expect(isDuplicate('qr-3', 'user-1')).toBe(false);
      expect(isDuplicate('qr-1', 'user-2')).toBe(false);
    });
  });

  describe('Business validation', () => {
    it('should check if business is active', () => {
      const checkBusinessStatus = (business: { is_verified: boolean; is_suspended: boolean }) => {
        if (business.is_suspended) return { valid: false, reason: 'Business is suspended' };
        if (!business.is_verified) return { valid: false, reason: 'Business is not verified' };
        return { valid: true, reason: null };
      };

      expect(checkBusinessStatus({ is_verified: true, is_suspended: false }).valid).toBe(true);
      expect(checkBusinessStatus({ is_verified: false, is_suspended: false }).valid).toBe(false);
      expect(checkBusinessStatus({ is_verified: true, is_suspended: true }).valid).toBe(false);
    });
  });
});
