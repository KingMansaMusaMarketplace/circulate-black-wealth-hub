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

// Enhanced sign up with password validation
export const secureSignUp = async (email: string, password: string, userData?: any) => {
  try {
    // Validate password complexity first
    const validation = validatePasswordComplexity(password);
    if (!validation.isValid) {
      toast.error(`Password requirements not met:\n${validation.errors.join('\n')}`);
      return { error: { message: validation.errors.join('. ') } };
    }

    // Proceed with sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData
      }
    });

    if (error) {
      // Log failed attempt (without password)
      await logFailedAuthAttempt(email, 'signup_failed');
      toast.error(error.message);
      return { error };
    }

    return { data };
  } catch (error: any) {
    await logFailedAuthAttempt(email, 'signup_error');
    toast.error('An unexpected error occurred during sign up');
    return { error };
  }
};

// Enhanced sign in with attempt logging
export const secureSignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Log failed attempt
      await logFailedAuthAttempt(email, 'signin_failed');
      toast.error(error.message);
      return { error };
    }

    return { data };
  } catch (error: any) {
    await logFailedAuthAttempt(email, 'signin_error');
    toast.error('An unexpected error occurred during sign in');
    return { error };
  }
};

// Enhanced password update with validation
export const secureUpdatePassword = async (newPassword: string) => {
  try {
    // Validate new password
    const validation = validatePasswordComplexity(newPassword);
    if (!validation.isValid) {
      toast.error(`Password requirements not met:\n${validation.errors.join('\n')}`);
      return { error: { message: validation.errors.join('. ') } };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    // Log password update for audit
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'password_update',
          table_name: 'auth.users',
          record_id: user.id,
          user_id: user.id
        });
    }

    toast.success('Password updated successfully');
    return { data };
  } catch (error: any) {
    toast.error('An unexpected error occurred updating password');
    return { error };
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