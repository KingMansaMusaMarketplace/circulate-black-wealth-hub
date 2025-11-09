import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd: string) => /\d/.test(pwd) },
    { label: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const passedChecks = checks.filter(check => check.test(password)).length;
  const strength = passedChecks === 0 ? 'none' : 
                   passedChecks <= 2 ? 'weak' : 
                   passedChecks <= 3 ? 'medium' : 
                   passedChecks <= 4 ? 'good' : 'strong';

  const strengthColors = {
    none: 'bg-muted',
    weak: 'bg-red-500',
    medium: 'bg-orange-500',
    good: 'bg-yellow-500',
    strong: 'bg-green-500'
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= passedChecks ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      <div className="space-y-1">
        {checks.map((check, idx) => {
          const passed = check.test(password);
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {passed ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
              <span className={passed ? 'text-green-600' : 'text-muted-foreground'}>
                {check.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
