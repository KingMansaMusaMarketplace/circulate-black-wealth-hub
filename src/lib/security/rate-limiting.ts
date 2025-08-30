import { supabase } from '@/integrations/supabase/client';

/**
 * Client-side rate limiting utility
 * Note: This is supplementary to server-side rate limiting
 */
class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if an operation is allowed based on rate limits
   */
  checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  /**
   * Clear rate limit data for a key
   */
  clearRateLimit(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string, maxAttempts: number, windowMs: number): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    return Math.max(0, maxAttempts - validAttempts.length);
  }
}

export const rateLimiter = new ClientRateLimiter();

/**
 * Check business access rate limit using Supabase function
 */
export const checkBusinessAccessRateLimit = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_business_access_rate_limit');
    
    if (error) {
      console.error('Error checking business access rate limit:', error);
      return true; // Allow access if check fails
    }
    
    return data === true;
  } catch (error) {
    console.error('Error checking business access rate limit:', error);
    return true; // Allow access if check fails
  }
};

/**
 * Rate limiting configuration for different operations
 */
export const rateLimitConfig = {
  authentication: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  businessAccess: {
    maxAttempts: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Helper function to create rate limit key
 */
export const createRateLimitKey = (operation: string, identifier: string): string => {
  return `${operation}:${identifier}`;
};