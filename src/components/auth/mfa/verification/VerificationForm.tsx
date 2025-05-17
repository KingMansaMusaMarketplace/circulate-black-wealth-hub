
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
  timeLeft: number;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  timeLeft 
}) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      onSubmit(verificationCode);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          autoFocus
          required
        />
        
        {timeLeft > 0 && (
          <p className="text-xs text-gray-500 text-center">
            Code expires in {formatTime(timeLeft)}
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || verificationCode.length !== 6}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify'
        )}
      </Button>
    </form>
  );
};
