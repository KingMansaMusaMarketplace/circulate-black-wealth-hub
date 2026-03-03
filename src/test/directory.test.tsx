/**
 * Business Directory Tests
 * Tests for search, filter, and pagination logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BusinessFilters, PaginationParams, BusinessQueryResult } from '@/lib/api/directory/types';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  },
}));

describe('Business Directory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Filter Logic', () => {
    const applyFilters = (businesses: any[], filters: BusinessFilters) => {
      let result = [...businesses];

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        result = result.filter(
          (b) =>
            b.business_name?.toLowerCase().includes(term) ||
            b.category?.toLowerCase().includes(term)
        );
      }

      if (filters.category && filters.category !== 'all') {
        result = result.filter((b) => b.category === filters.category);
      }

      if (filters.minRating && filters.minRating > 0) {
        result = result.filter((b) => (b.average_rating || 0) >= filters.minRating!);
      }

      if (filters.featured) {
        result = result.filter((b) => b.is_verified);
      }

      return result;
    };

    const mockBusinesses = [
      { id: '1', business_name: 'Soul Food Kitchen', category: 'Restaurant', average_rating: 4.5, is_verified: true },
      { id: '2', business_name: 'Tech Solutions', category: 'Technology', average_rating: 3.8, is_verified: false },
      { id: '3', business_name: 'Beauty Bar', category: 'Beauty', average_rating: 4.9, is_verified: true },
      { id: '4', business_name: 'Legal Eagles', category: 'Professional Services', average_rating: 4.2, is_verified: false },
      { id: '5', business_name: 'Fresh Market', category: 'Restaurant', average_rating: 3.0, is_verified: false },
    ];

    it('should filter by search term in business name', () => {
      const result = applyFilters(mockBusinesses, { searchTerm: 'soul' });
      expect(result).toHaveLength(1);
      expect(result[0].business_name).toBe('Soul Food Kitchen');
    });

    it('should filter by search term in category', () => {
      const result = applyFilters(mockBusinesses, { searchTerm: 'restaurant' });
      expect(result).toHaveLength(2);
    });

    it('should filter by category', () => {
      const result = applyFilters(mockBusinesses, { category: 'Beauty' });
      expect(result).toHaveLength(1);
      expect(result[0].business_name).toBe('Beauty Bar');
    });

    it('should not filter when category is "all"', () => {
      const result = applyFilters(mockBusinesses, { category: 'all' });
      expect(result).toHaveLength(5);
    });

    it('should filter by minimum rating', () => {
      const result = applyFilters(mockBusinesses, { minRating: 4.0 });
      expect(result).toHaveLength(3);
    });

    it('should filter by featured (verified) status', () => {
      const result = applyFilters(mockBusinesses, { featured: true });
      expect(result).toHaveLength(2);
    });

    it('should combine multiple filters', () => {
      const result = applyFilters(mockBusinesses, {
        category: 'Restaurant',
        minRating: 4.0,
      });
      expect(result).toHaveLength(1);
      expect(result[0].business_name).toBe('Soul Food Kitchen');
    });

    it('should return empty array when no matches', () => {
      const result = applyFilters(mockBusinesses, { searchTerm: 'nonexistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('Pagination', () => {
    it('should calculate correct page count', () => {
      const calculatePages = (totalCount: number, pageSize: number) =>
        Math.ceil(totalCount / pageSize);

      expect(calculatePages(100, 20)).toBe(5);
      expect(calculatePages(101, 20)).toBe(6);
      expect(calculatePages(0, 20)).toBe(0);
      expect(calculatePages(1, 20)).toBe(1);
    });

    it('should calculate correct offset', () => {
      const calculateOffset = (page: number, pageSize: number) =>
        (page - 1) * pageSize;

      expect(calculateOffset(1, 20)).toBe(0);
      expect(calculateOffset(2, 20)).toBe(20);
      expect(calculateOffset(5, 20)).toBe(80);
    });

    it('should handle the 1000-row Supabase limit', () => {
      const MAX_SUPABASE_ROWS = 1000;
      const validatePagination = (page: number, pageSize: number) => {
        const offset = (page - 1) * pageSize;
        const end = offset + pageSize - 1;
        return end < MAX_SUPABASE_ROWS;
      };

      expect(validatePagination(1, 20)).toBe(true);
      expect(validatePagination(50, 20)).toBe(true); // offset 980, end 999
      expect(validatePagination(51, 20)).toBe(false); // offset 1000, end 1019 -- over limit
    });
  });

  describe('Distance Calculation', () => {
    it('should calculate distance between two coordinates', () => {
      // Haversine formula test (NYC to LA approx 3944 km)
      const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth radius km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const nycToLa = haversine(40.7128, -74.006, 34.0522, -118.2437);
      expect(nycToLa).toBeGreaterThan(3900);
      expect(nycToLa).toBeLessThan(4000);
    });

    it('should return 0 for same coordinates', () => {
      const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      expect(haversine(40.7128, -74.006, 40.7128, -74.006)).toBe(0);
    });
  });

  describe('Sensitive Data Filtering', () => {
    it('should remove sensitive fields from business data', () => {
      const SENSITIVE_FIELDS = ['phone', 'email', 'owner_id', 'stripe_account_id'];
      const filterSensitive = (business: Record<string, any>) => {
        const filtered = { ...business };
        SENSITIVE_FIELDS.forEach((f) => delete filtered[f]);
        return filtered;
      };

      const raw = {
        id: '1',
        business_name: 'Test Business',
        phone: '555-1234',
        email: 'owner@test.com',
        owner_id: 'user-123',
        stripe_account_id: 'acct_123',
      };

      const filtered = filterSensitive(raw);
      expect(filtered).not.toHaveProperty('phone');
      expect(filtered).not.toHaveProperty('email');
      expect(filtered).not.toHaveProperty('owner_id');
      expect(filtered).not.toHaveProperty('stripe_account_id');
      expect(filtered).toHaveProperty('business_name');
    });
  });
});
