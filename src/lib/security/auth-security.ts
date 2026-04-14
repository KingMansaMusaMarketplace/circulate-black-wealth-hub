import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logFailedAuthAttempt } from './audit-logger';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

// Client-side password complexity validation
export const validatePasswordComplexity = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Client-side signup cooldown to replace server-side rate limiting for anonymous users
const signupCooldowns = new Map<string, number>();
const SIGNUP_COOLDOWN_MS = 30_000; // 30 seconds between signup attempts per email
const MAX_SIGNUP_ATTEMPTS = 5;
const SIGNUP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const signupAttemptCounts = new Map<string, { count: number; windowStart: number }>();

const checkClientSideSignupLimit = (email: string): { allowed: boolean; message?: string } => {
  const now = Date.now();
  const normalizedEmail = email.toLowerCase().trim();

  // Check cooldown
  const lastAttempt = signupCooldowns.get(normalizedEmail);
  if (lastAttempt && now - lastAttempt < SIGNUP_COOLDOWN_MS) {
    const waitSec = Math.ceil((SIGNUP_COOLDOWN_MS - (now - lastAttempt)) / 1000);
    return { allowed: false, message: `Please wait ${waitSec} seconds before trying again.` };
  }

  // Check attempt count in window
  const attempts = signupAttemptCounts.get(normalizedEmail);
  if (attempts) {
    if (now - attempts.windowStart > SIGNUP_WINDOW_MS) {
      // Reset window
      signupAttemptCounts.set(normalizedEmail, { count: 1, windowStart: now });
    } else if (attempts.count >= MAX_SIGNUP_ATTEMPTS) {
      return { allowed: false, message: 'Too many signup attempts. Please try again in 15 minutes.' };
    } else {
      attempts.count++;
    }
  } else {
    signupAttemptCounts.set(normalizedEmail, { count: 1, windowStart: now });
  }

  signupCooldowns.set(normalizedEmail, now);
  return { allowed: true };
};

// Enhanced sign up with password validation and CLIENT-SIDE rate limiting
// (Server-side rate limiting via check_rate_limit_secure uses auth.uid() which is NULL for anonymous users)
export const secureSignUp = async (email: string, password: string, userData?: any) => {
  try {
    // Use client-side rate limiting instead of server-side RPC (which requires auth.uid())
    const rateCheck = checkClientSideSignupLimit(email);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: rateCheck.message || 'Rate limit exceeded. Please try again later.',
      };
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: 'Password does not meet requirements:\n• ' + passwordValidation.errors.join('\n• ')
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/email-verified`
      }
    });

    if (error) {
      // Log failed signup attempt (best-effort, may fail for anon users)
      try {
        await supabase.rpc('log_failed_auth_attempt', {
          email_param: email,
          reason_param: error.message,
          user_agent_param: navigator.userAgent
        });
      } catch (logErr) {
        console.warn('Could not log failed auth attempt (expected for anon users):', logErr);
      }
      
      // Provide user-friendly error messages
      let friendlyError = error.message;
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        friendlyError = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('rate') || error.message.includes('limit')) {
        friendlyError = 'Too many attempts. Please wait a few minutes and try again.';
      } else if (error.message.includes('password')) {
        friendlyError = 'Password is too weak. Please include uppercase, lowercase, number, and special character.';
      }
      
      return { success: false, error: friendlyError };
    }

    // Log successful signup activity (best-effort)
    if (data.user) {
      try {
        await supabase.rpc('log_user_activity', {
          p_user_id: data.user.id,
          p_activity_type: 'account_created',
          p_activity_data: { email, signup_method: 'email_password' }
        });
      } catch (logErr) {
        console.warn('Could not log signup activity:', logErr);
      }

      // Activate beta tester if applicable (non-blocking)
      try {
        const { data: isBeta } = await supabase.rpc('activate_beta_tester', {
          p_email: email,
          p_user_id: data.user.id,
        });
        if (isBeta) {
          console.log('[SECURE SIGNUP] Beta tester activated — free access granted');
        }
      } catch (betaErr) {
        console.warn('[SECURE SIGNUP] Beta tester check failed (non-blocking):', betaErr);
      }
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred. Please try again.' };
  }
};

// Enhanced sign in with rate limiting and attempt logging
export const secureSignIn = async (email: string, password: string) => {
  try {
    // Check rate limit first  
    const { data: rateLimitResult } = await supabase.rpc('check_rate_limit_secure', {
      operation_name: 'signin',
      max_attempts: 5,
      window_minutes: 15
    });

    if (rateLimitResult && !rateLimitResult.allowed) {
      return {
        success: false,
        error: `Too many login attempts. ${rateLimitResult.message}`,
        rateLimitInfo: rateLimitResult
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Log failed signin attempt with enhanced tracking
      await supabase.rpc('log_failed_auth_attempt', {
        email_param: email,
        reason_param: error.message,
        user_agent_param: navigator.userAgent
      });
      
      return { success: false, error: error.message };
    }

    // Log successful signin activity
    if (data.user) {
      await supabase.rpc('log_user_activity', {
        p_user_id: data.user.id,
        p_activity_type: 'user_signin',
        p_activity_data: { email, signin_method: 'email_password' }
      });
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Enhanced password update with validation and rate limiting
export const secureUpdatePassword = async (newPassword: string) => {
  try {
    // Check rate limit for password changes
    const { data: rateLimitResult } = await supabase.rpc('check_rate_limit_secure', {
      operation_name: 'password_change',
      max_attempts: 3,
      window_minutes: 60
    });

    if (rateLimitResult && !rateLimitResult.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded for password changes. ${rateLimitResult.message}`,
        rateLimitInfo: rateLimitResult
      };
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: 'Password does not meet complexity requirements: ' + passwordValidation.errors.join(', ')
      };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log password change in security audit with enhanced tracking
    if (data.user) {
      await supabase.rpc('log_user_activity', {
        p_user_id: data.user.id,
        p_activity_type: 'password_update_success',
        p_activity_data: { 
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Check if business access is rate limited
export const checkBusinessAccessRateLimit = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_business_access_rate_limit');
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to avoid blocking legitimate access
    }
    
    return data;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true;
  }
};

// Log business data access for audit trail
export const logBusinessDataAccess = async (businessId: string, accessType: string = 'view') => {
  try {
    await supabase
      .from('business_access_log')
      .insert({
        business_id: businessId,
        access_type: accessType,
        user_agent: navigator.userAgent
      });
  } catch (error) {
    console.error('Failed to log business access:', error);
  }
};
