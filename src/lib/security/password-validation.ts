import { supabase } from '@/integrations/supabase/client';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePasswordComplexity = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Must contain uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Must contain lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Must contain number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Must contain special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  // Check for common weak patterns
  if (/123456|password|qwerty|abc123|admin|user/i.test(password)) {
    errors.push('Password contains common weak patterns');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePasswordWithSupabase = async (password: string): Promise<PasswordValidationResult> => {
  try {
    const { data, error } = await supabase.rpc('validate_password_complexity', {
      password
    });

    if (error) {
      console.error('Error validating password with Supabase:', error);
      // Fallback to client-side validation
      return validatePasswordComplexity(password);
    }

    if (!data) {
      return {
        isValid: false,
        errors: ['Password does not meet complexity requirements']
      };
    }

    return { isValid: true, errors: [] };
  } catch (error) {
    console.error('Error validating password:', error);
    // Fallback to client-side validation
    return validatePasswordComplexity(password);
  }
};

export const logFailedAuthAttempt = async (
  email: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await supabase.rpc('log_failed_auth_attempt', {
      email_param: email,
      reason_param: reason,
      ip_param: ipAddress,
      user_agent_param: userAgent || navigator.userAgent
    });
  } catch (error) {
    console.error('Failed to log failed auth attempt:', error);
  }
};