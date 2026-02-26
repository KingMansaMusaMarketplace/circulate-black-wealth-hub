import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Must import after mocks
import { useOfflineSupport } from '@/hooks/use-offline-support';

describe('useOfflineSupport', () => {
  beforeEach(() => {
    localStorage.clear();
    // Default to online
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize as online when navigator.onLine is true', () => {
    const { result } = renderHook(() => useOfflineSupport());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.offlineQueue).toBe(0);
  });

  it('should detect offline state', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    const { result } = renderHook(() => useOfflineSupport());
    expect(result.current.isOnline).toBe(false);
  });

  it('should queue actions when offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    const { result } = renderHook(() => useOfflineSupport());

    act(() => {
      const queued = result.current.queueAction({
        type: 'business_favorite',
        userId: 'user-1',
        businessId: 'biz-1',
        isFavorite: true,
      });
      expect(queued).toBe(true);
    });

    expect(result.current.offlineQueue).toBe(1);
  });

  it('should not queue actions when online', () => {
    const { result } = renderHook(() => useOfflineSupport());

    act(() => {
      const queued = result.current.queueAction({
        type: 'business_favorite',
        userId: 'user-1',
        businessId: 'biz-1',
        isFavorite: true,
      });
      expect(queued).toBe(false);
    });

    expect(result.current.offlineQueue).toBe(0);
  });

  it('should cache and retrieve business data', () => {
    const { result } = renderHook(() => useOfflineSupport());
    const businesses = [{ id: '1', name: 'Test Biz' }];

    act(() => {
      result.current.cacheBusinessData(businesses);
    });

    const cached = result.current.getCachedBusinessData();
    expect(cached).toEqual(businesses);
  });

  it('should cache and retrieve profile data', () => {
    const { result } = renderHook(() => useOfflineSupport());
    const profile = { id: 'user-1', name: 'Test User' };

    act(() => {
      result.current.cacheProfileData(profile);
    });

    const cached = result.current.getCachedProfileData();
    expect(cached).toEqual(profile);
  });

  it('should cache and retrieve favorites', () => {
    const { result } = renderHook(() => useOfflineSupport());
    const favorites = [{ id: '1', businessId: 'biz-1' }];

    act(() => {
      result.current.cacheFavorites(favorites);
    });

    const cached = result.current.getCachedFavorites();
    expect(cached).toEqual(favorites);
  });

  it('should return null for expired cache', () => {
    // Set cache with old timestamp
    localStorage.setItem('cached_businesses', JSON.stringify({
      data: [{ id: '1' }],
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    }));

    const { result } = renderHook(() => useOfflineSupport());
    const cached = result.current.getCachedBusinessData();
    expect(cached).toBeNull();
  });

  it('should persist queue to localStorage', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    const { result } = renderHook(() => useOfflineSupport());

    act(() => {
      result.current.queueAction({
        type: 'review_submit',
        userId: 'user-1',
        businessId: 'biz-1',
        rating: 5,
        comment: 'Great!',
      });
    });

    const stored = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].type).toBe('review_submit');
  });
});
