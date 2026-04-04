/**
 * Client-side wrapper for the auth-rate-guard edge function.
 * Call `checkAuthRateLimit` before every login/signup/password-reset attempt.
 * Call `resetAuthRateLimit` after a successful authentication.
 */

import { supabase } from '@/integrations/supabase/client';

export interface RateLimitResult {
  allowed: boolean;
  remaining_attempts: number;
  retry_after_seconds: number;
  blocked_until?: string | null;
}

/**
 * Check if an auth attempt is allowed (pre-flight).
 * Returns { allowed: true } if within limits, or { allowed: false, retry_after_seconds } if blocked.
 */
export async function checkAuthRateLimit(
  identifier: string,
  attemptType: 'login' | 'signup' | 'password_reset' = 'login'
): Promise<RateLimitResult> {
  try {
    const { data, error } = await supabase.functions.invoke('auth-rate-guard', {
      body: { identifier, attempt_type: attemptType },
    });

    if (error) {
      console.error('[AuthRateGuard] Check failed:', error);
      // Fail open
      return { allowed: true, remaining_attempts: 5, retry_after_seconds: 0 };
    }

    return data as RateLimitResult;
  } catch (err) {
    console.error('[AuthRateGuard] Network error:', err);
    return { allowed: true, remaining_attempts: 5, retry_after_seconds: 0 };
  }
}

/**
 * Reset rate limit after successful authentication.
 */
export async function resetAuthRateLimit(
  identifier: string,
  attemptType: 'login' | 'signup' | 'password_reset' = 'login'
): Promise<void> {
  try {
    await supabase.functions.invoke('auth-rate-guard', {
      body: { identifier, attempt_type: attemptType, success: true },
    });
  } catch (err) {
    // Non-critical — just log
    console.error('[AuthRateGuard] Reset failed:', err);
  }
}
