import { describe, it, expect, vi } from 'vitest';
import type { QRCode, QRCodeGenerationParams, QRCodeScanResult } from '@/lib/api/qr-code-api';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Helper functions to test
const isValidQRCodeId = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

const canScanQRCode = (qrCode: QRCode): { canScan: boolean; reason?: string } => {
  // Check if QR code is active
  if (!qrCode.is_active) {
    return { canScan: false, reason: 'QR code is inactive' };
  }

  // Check expiration
  if (qrCode.expiration_date) {
    const expirationDate = new Date(qrCode.expiration_date);
    if (expirationDate < new Date()) {
      return { canScan: false, reason: 'QR code has expired' };
    }
  }

  // Check scan limit
  if (qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit) {
    return { canScan: false, reason: 'QR code scan limit reached' };
  }

  return { canScan: true };
};

const calculatePointsFromScan = (qrCode: QRCode): number => {
  if (qrCode.code_type !== 'loyalty') return 0;
  return qrCode.points_value || 0;
};

const calculateDiscountFromScan = (qrCode: QRCode, orderTotal: number): number => {
  if (qrCode.code_type !== 'discount') return 0;
  const percentage = qrCode.discount_percentage || 0;
  return orderTotal * (percentage / 100);
};

describe('QR Code System', () => {
  describe('UUID Validation', () => {
    it('should validate correct UUIDs', () => {
      expect(isValidQRCodeId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidQRCodeId('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(isValidQRCodeId('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidQRCodeId('')).toBe(false);
      expect(isValidQRCodeId('not-a-uuid')).toBe(false);
      expect(isValidQRCodeId('550e8400-e29b-41d4-a716')).toBe(false); // Too short
      expect(isValidQRCodeId('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(false); // Too long
      expect(isValidQRCodeId('gggggggg-gggg-gggg-gggg-gggggggggggg')).toBe(false); // Invalid chars
    });
  });

  describe('Scan Limit Enforcement', () => {
    const baseQRCode: QRCode = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      business_id: 'business-123',
      code_type: 'loyalty',
      is_active: true,
      current_scans: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should allow scan when no limit is set', () => {
      const qrCode = { ...baseQRCode, scan_limit: undefined, current_scans: 100 };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(true);
    });

    it('should allow scan when under limit', () => {
      const qrCode = { ...baseQRCode, scan_limit: 10, current_scans: 5 };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(true);
    });

    it('should deny scan when limit reached', () => {
      const qrCode = { ...baseQRCode, scan_limit: 10, current_scans: 10 };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(false);
      expect(result.reason).toBe('QR code scan limit reached');
    });

    it('should deny scan when limit exceeded', () => {
      const qrCode = { ...baseQRCode, scan_limit: 10, current_scans: 15 };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(false);
      expect(result.reason).toBe('QR code scan limit reached');
    });

    it('should handle zero scan limit as unlimited', () => {
      // Zero scan limit is treated as "no limit" (unlimited scans)
      const qrCode = { ...baseQRCode, scan_limit: 0, current_scans: 0 };
      const result = canScanQRCode(qrCode);
      // 0 limit means current_scans (0) is not >= scan_limit (0) in our implementation
      // This is correct behavior: 0 means no limit enforcement
      expect(result.canScan).toBe(true);
    });
  });

  describe('Inactive QR Code Handling', () => {
    const baseQRCode: QRCode = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      business_id: 'business-123',
      code_type: 'loyalty',
      is_active: false,
      current_scans: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should deny scan for inactive QR code', () => {
      const result = canScanQRCode(baseQRCode);
      expect(result.canScan).toBe(false);
      expect(result.reason).toBe('QR code is inactive');
    });

    it('should allow scan for active QR code', () => {
      const qrCode = { ...baseQRCode, is_active: true };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(true);
    });
  });

  describe('Expiration Handling', () => {
    const baseQRCode: QRCode = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      business_id: 'business-123',
      code_type: 'loyalty',
      is_active: true,
      current_scans: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should allow scan when no expiration is set', () => {
      const qrCode = { ...baseQRCode, expiration_date: undefined };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(true);
    });

    it('should allow scan when expiration is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const qrCode = { ...baseQRCode, expiration_date: futureDate.toISOString() };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(true);
    });

    it('should deny scan when expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const qrCode = { ...baseQRCode, expiration_date: pastDate.toISOString() };
      const result = canScanQRCode(qrCode);
      expect(result.canScan).toBe(false);
      expect(result.reason).toBe('QR code has expired');
    });
  });

  describe('Points Calculation', () => {
    const loyaltyQRCode: QRCode = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      business_id: 'business-123',
      code_type: 'loyalty',
      points_value: 50,
      is_active: true,
      current_scans: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should return correct points for loyalty QR code', () => {
      expect(calculatePointsFromScan(loyaltyQRCode)).toBe(50);
    });

    it('should return 0 for discount QR code', () => {
      const discountQR = { ...loyaltyQRCode, code_type: 'discount' as const, discount_percentage: 10 };
      expect(calculatePointsFromScan(discountQR)).toBe(0);
    });

    it('should return 0 for checkin QR code', () => {
      const checkinQR = { ...loyaltyQRCode, code_type: 'checkin' as const };
      expect(calculatePointsFromScan(checkinQR)).toBe(0);
    });

    it('should handle undefined points_value', () => {
      const qrCode = { ...loyaltyQRCode, points_value: undefined };
      expect(calculatePointsFromScan(qrCode)).toBe(0);
    });
  });

  describe('Discount Calculation', () => {
    const discountQRCode: QRCode = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      business_id: 'business-123',
      code_type: 'discount',
      discount_percentage: 20,
      is_active: true,
      current_scans: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should calculate correct discount amount', () => {
      expect(calculateDiscountFromScan(discountQRCode, 100)).toBe(20);
      expect(calculateDiscountFromScan(discountQRCode, 50)).toBe(10);
      expect(calculateDiscountFromScan(discountQRCode, 250)).toBe(50);
    });

    it('should return 0 for non-discount QR codes', () => {
      const loyaltyQR = { ...discountQRCode, code_type: 'loyalty' as const };
      expect(calculateDiscountFromScan(loyaltyQR, 100)).toBe(0);
    });

    it('should handle 100% discount', () => {
      const fullDiscountQR = { ...discountQRCode, discount_percentage: 100 };
      expect(calculateDiscountFromScan(fullDiscountQR, 100)).toBe(100);
    });

    it('should handle undefined discount_percentage', () => {
      const qrCode = { ...discountQRCode, discount_percentage: undefined };
      expect(calculateDiscountFromScan(qrCode, 100)).toBe(0);
    });

    it('should handle zero order total', () => {
      expect(calculateDiscountFromScan(discountQRCode, 0)).toBe(0);
    });
  });
});
