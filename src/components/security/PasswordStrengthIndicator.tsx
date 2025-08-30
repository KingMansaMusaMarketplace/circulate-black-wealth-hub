import React from 'react';
import { validatePasswordComplexity } from '@/lib/security/auth-security';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = '' 
}) => {
  const validation = validatePasswordComplexity(password);
  
  if (!password) return null;

  const getStrengthColor = () => {
    if (validation.isValid) return 'text-green-600';
    if (validation.errors.length <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthText = () => {
    if (validation.isValid) return 'Strong';
    if (validation.errors.length <= 2) return 'Moderate';
    return 'Weak';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className={`text-sm font-medium ${getStrengthColor()}`}>
        Password Strength: {getStrengthText()}
      </div>
      
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Requirements:</div>
          <ul className="text-xs space-y-1">
            <li className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>
              ✓ At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
              ✓ One uppercase letter
            </li>
            <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
              ✓ One lowercase letter
            </li>
            <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>
              ✓ One number
            </li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-red-600'}>
              ✓ One special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};