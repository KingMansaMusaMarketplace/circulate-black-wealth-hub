/**
 * Password validation utilities with enhanced security
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
}

export const validatePasswordComplexity = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  } else {
    score += 1;
  }

  // Common patterns check
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns that are easily guessed');
    score -= 1;
  }

  // Repetitive characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repetitive characters');
    score -= 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else if (score <= 6) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

export const getPasswordStrengthColor = (strength: string): string => {
  switch (strength) {
    case 'weak':
      return 'text-destructive';
    case 'medium':
      return 'text-warning';
    case 'strong':
      return 'text-success';
    case 'very-strong':
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
};

export const checkPasswordAgainstBreaches = async (password: string): Promise<boolean> => {
  // In a real implementation, you'd check against a service like HaveIBeenPwned
  // For now, we'll just check against a few common breached passwords
  const commonBreachedPasswords = [
    'password123',
    'admin123',
    'welcome123',
    'password1',
    '123456789',
    'qwerty123'
  ];
  
  return !commonBreachedPasswords.includes(password.toLowerCase());
};