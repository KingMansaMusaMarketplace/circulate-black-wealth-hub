/**
 * Client-side rate limiting utilities
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if an action is allowed based on rate limiting
   * @param key - Unique identifier for the action (e.g., user ID + action type)
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if action is allowed, false if rate limited
   */
  checkLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window has reset
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false; // Rate limited
    }

    // Increment count
    entry.count++;
    this.limits.set(key, entry);
    return true;
  }

  /**
   * Get remaining time until rate limit resets
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Clear rate limit for a specific key
   */
  clear(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.limits.clear();
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Predefined rate limiting functions for common actions
export const checkAuthRateLimit = (userId: string): boolean => {
  return rateLimiter.checkLimit(`auth:${userId}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
};

export const checkBusinessSearchRateLimit = (userId: string): boolean => {
  return rateLimiter.checkLimit(`business-search:${userId}`, 100, 60 * 1000); // 100 searches per minute
};

export const checkQRScanRateLimit = (userId: string): boolean => {
  return rateLimiter.checkLimit(`qr-scan:${userId}`, 10, 60 * 1000); // 10 scans per minute
};

export const checkProfileUpdateRateLimit = (userId: string): boolean => {
  return rateLimiter.checkLimit(`profile-update:${userId}`, 3, 60 * 1000); // 3 updates per minute
};

export const getAuthResetTime = (userId: string): number => {
  return rateLimiter.getResetTime(`auth:${userId}`);
};