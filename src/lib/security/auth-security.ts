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

// Enhanced sign up with password validation and rate limiting
export const secureSignUp = async (email: string, password: string, userData?: any) => {
  try {
    // Check rate limit first
    const { data: rateLimitResult } = await supabase.rpc('check_rate_limit_secure', {
      operation_name: 'signup',
      max_attempts: 3,
      window_minutes: 60
    });

    if (rateLimitResult && !rateLimitResult.allowed) {      
      return {
        success: false,
        error: `Rate limit exceeded. ${rateLimitResult.message}`,
        rateLimitInfo: rateLimitResult
      };
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: 'Password does not meet complexity requirements: ' + passwordValidation.errors.join(', ')
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
      // Log failed signup attempt with enhanced audit trail
      await supabase.rpc('log_failed_auth_attempt', {
        email_param: email,
        reason_param: error.message,
        user_agent_param: navigator.userAgent
      });
      
      return { success: false, error: error.message };
    }

    // Log successful signup activity
    if (data.user) {
      await supabase.rpc('log_user_activity', {
        p_user_id: data.user.id,
        p_activity_type: 'account_created',
        p_activity_data: { email, signup_method: 'email_password' }
      });
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
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