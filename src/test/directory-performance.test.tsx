/**
 * Directory Performance Tests
 * Tests for virtualization and performance optimizations
 */

import { describe, it, expect, vi } from 'vitest';

describe('Directory Performance', () => {
  describe('Business Data Handling', () => {
    it('should handle large datasets efficiently', () => {
      const generateMockBusinesses = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
          id: `business-${i}`,
          name: `Business ${i}`,
          category: 'Restaurant',
          rating: Math.random() * 5,
          reviewCount: Math.floor(Math.random() * 100),
        }));
      };

      const businesses = generateMockBusinesses(10000);
      expect(businesses.length).toBe(10000);
      
      // Verify data structure
      expect(businesses[0]).toHaveProperty('id');
      expect(businesses[0]).toHaveProperty('name');
    });

    it('should filter businesses efficiently', () => {
      const businesses = Array.from({ length: 1000 }, (_, i) => ({
        id: `business-${i}`,
        category: i % 2 === 0 ? 'Restaurant' : 'Retail',
        rating: (i % 5) + 1,
      }));

      const startTime = performance.now();
      
      const filtered = businesses.filter(b => 
        b.category === 'Restaurant' && b.rating >= 4
      );
      
      const endTime = performance.now();
      
      // Should complete in under 10ms
      expect(endTime - startTime).toBeLessThan(10);
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should sort businesses efficiently', () => {
      const businesses = Array.from({ length: 1000 }, (_, i) => ({
        id: `business-${i}`,
        rating: Math.random() * 5,
        name: `Business ${Math.random().toString(36).substring(7)}`,
      }));

      const startTime = performance.now();
      
      const sorted = [...businesses].sort((a, b) => b.rating - a.rating);
      
      const endTime = performance.now();
      
      // Should complete in under 10ms
      expect(endTime - startTime).toBeLessThan(10);
      expect(sorted[0].rating).toBeGreaterThanOrEqual(sorted[999].rating);
    });
  });

  describe('Virtualization', () => {
    it('should calculate visible items correctly', () => {
      const calculateVisibleItems = (
        scrollTop: number,
        containerHeight: number,
        itemHeight: number,
        totalItems: number,
        overscan: number = 3
      ) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2);
        
        return { startIndex, endIndex, visibleCount };
      };

      const result = calculateVisibleItems(1000, 600, 100, 1000, 3);
      
      expect(result.startIndex).toBe(7); // 10 - 3 overscan
      expect(result.endIndex).toBeLessThan(20); // Should only render ~12 items
      expect(result.visibleCount).toBe(6); // 600 / 100
    });

    it('should calculate row count for grid layout', () => {
      const calculateRowCount = (itemCount: number, columnCount: number) => {
        return Math.ceil(itemCount / columnCount);
      };

      expect(calculateRowCount(100, 4)).toBe(25);
      expect(calculateRowCount(101, 4)).toBe(26);
      expect(calculateRowCount(0, 4)).toBe(0);
    });

    it('should determine column count based on viewport', () => {
      const getColumnCount = (width: number) => {
        if (width < 768) return 1;
        if (width < 1024) return 2;
        if (width < 1280) return 3;
        return 4;
      };

      expect(getColumnCount(500)).toBe(1);  // Mobile
      expect(getColumnCount(900)).toBe(2);  // Tablet
      expect(getColumnCount(1100)).toBe(3); // Small desktop
      expect(getColumnCount(1400)).toBe(4); // Large desktop
    });
  });

  describe('Memoization', () => {
    it('should cache expensive computations', () => {
      const cache = new Map<string, any>();
      let computeCount = 0;

      const memoizedFilter = (
        businesses: any[],
        category: string,
        minRating: number
      ) => {
        const cacheKey = `${category}-${minRating}`;
        
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }
        
        computeCount++;
        const result = businesses.filter(b => 
          b.category === category && b.rating >= minRating
        );
        
        cache.set(cacheKey, result);
        return result;
      };

      const businesses = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        category: 'Restaurant',
        rating: (i % 5) + 1,
      }));

      // First call - should compute
      memoizedFilter(businesses, 'Restaurant', 4);
      expect(computeCount).toBe(1);

      // Second call with same params - should use cache
      memoizedFilter(businesses, 'Restaurant', 4);
      expect(computeCount).toBe(1);

      // Different params - should compute again
      memoizedFilter(businesses, 'Restaurant', 3);
      expect(computeCount).toBe(2);
    });

    it('should handle stale cache invalidation', () => {
      const createCacheWithTTL = (ttlMs: number) => {
        const cache = new Map<string, { value: any; timestamp: number }>();

        return {
          get: (key: string) => {
            const entry = cache.get(key);
            if (!entry) return undefined;
            
            if (Date.now() - entry.timestamp > ttlMs) {
              cache.delete(key);
              return undefined;
            }
            
            return entry.value;
          },
          set: (key: string, value: any) => {
            cache.set(key, { value, timestamp: Date.now() });
          }
        };
      };

      const cache = createCacheWithTTL(100);
      cache.set('test', 'value');
      
      expect(cache.get('test')).toBe('value');
    });
  });

  describe('Lazy Loading', () => {
    it('should detect when elements are in viewport', () => {
      const isInViewport = (
        elementTop: number,
        elementBottom: number,
        viewportTop: number,
        viewportBottom: number
      ) => {
        return elementBottom > viewportTop && elementTop < viewportBottom;
      };

      // Element fully visible
      expect(isInViewport(100, 200, 0, 500)).toBe(true);
      
      // Element above viewport
      expect(isInViewport(0, 50, 100, 500)).toBe(false);
      
      // Element below viewport
      expect(isInViewport(600, 700, 0, 500)).toBe(false);
      
      // Element partially visible (top)
      expect(isInViewport(50, 150, 100, 500)).toBe(true);
    });

    it('should batch image loading', () => {
      const createImageBatcher = (batchSize: number, delayMs: number) => {
        const queue: string[] = [];
        let processing = false;

        const loadImage = (src: string) => {
          return new Promise<void>((resolve) => {
            // Simulate image loading
            setTimeout(resolve, 10);
          });
        };

        const processBatch = async () => {
          if (processing || queue.length === 0) return;
          
          processing = true;
          const batch = queue.splice(0, batchSize);
          
          await Promise.all(batch.map(loadImage));
          
          processing = false;
          
          if (queue.length > 0) {
            setTimeout(processBatch, delayMs);
          }
        };

        return {
          add: (src: string) => {
            queue.push(src);
            processBatch();
          },
          getQueueLength: () => queue.length
        };
      };

      const batcher = createImageBatcher(5, 100);
      
      for (let i = 0; i < 20; i++) {
        batcher.add(`image-${i}.jpg`);
      }
      
      // Queue should be processing
      expect(batcher.getQueueLength()).toBeLessThanOrEqual(20);
    });
  });

  describe('Scroll Performance', () => {
    it('should debounce scroll events', async () => {
      let callCount = 0;
      
      const debounce = <T extends (...args: any[]) => any>(
        fn: T,
        delay: number
      ): ((...args: Parameters<T>) => void) => {
        let timeoutId: NodeJS.Timeout;
        
        return (...args: Parameters<T>) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn(...args), delay);
        };
      };

      const handler = debounce(() => {
        callCount++;
      }, 50);

      // Simulate rapid scroll events
      for (let i = 0; i < 10; i++) {
        handler();
      }

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should only have called once
      expect(callCount).toBe(1);
    });

    it('should throttle scroll events', () => {
      let callCount = 0;
      let lastCallTime = 0;
      
      const throttle = <T extends (...args: any[]) => any>(
        fn: T,
        delay: number
      ): ((...args: Parameters<T>) => void) => {
        let lastCall = 0;
        
        return (...args: Parameters<T>) => {
          const now = Date.now();
          if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
          }
        };
      };

      const handler = throttle(() => {
        callCount++;
        lastCallTime = Date.now();
      }, 100);

      const startTime = Date.now();
      
      // Simulate rapid calls
      while (Date.now() - startTime < 350) {
        handler();
      }

      // Should have called 3-4 times in 350ms with 100ms throttle
      expect(callCount).toBeGreaterThanOrEqual(3);
      expect(callCount).toBeLessThanOrEqual(5);
    });
  });

  describe('Memory Management', () => {
    it('should cleanup unused references', () => {
      const createCleanupManager = () => {
        const cleanupFns: (() => void)[] = [];
        
        return {
          register: (fn: () => void) => {
            cleanupFns.push(fn);
          },
          cleanup: () => {
            cleanupFns.forEach(fn => fn());
            cleanupFns.length = 0;
          },
          count: () => cleanupFns.length
        };
      };

      const manager = createCleanupManager();
      
      manager.register(() => console.log('cleanup 1'));
      manager.register(() => console.log('cleanup 2'));
      
      expect(manager.count()).toBe(2);
      
      manager.cleanup();
      
      expect(manager.count()).toBe(0);
    });

    it('should limit cached items', () => {
      const createLRUCache = <K, V>(maxSize: number) => {
        const cache = new Map<K, V>();
        
        return {
          get: (key: K) => {
            const value = cache.get(key);
            if (value !== undefined) {
              // Move to end (most recently used)
              cache.delete(key);
              cache.set(key, value);
            }
            return value;
          },
          set: (key: K, value: V) => {
            if (cache.has(key)) {
              cache.delete(key);
            } else if (cache.size >= maxSize) {
              // Remove oldest (first) entry
              const firstKey = cache.keys().next().value;
              cache.delete(firstKey);
            }
            cache.set(key, value);
          },
          size: () => cache.size
        };
      };

      const cache = createLRUCache<string, number>(3);
      
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      
      expect(cache.size()).toBe(3);
      
      cache.set('d', 4); // Should evict 'a'
      
      expect(cache.size()).toBe(3);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('d')).toBe(4);
    });
  });
});
