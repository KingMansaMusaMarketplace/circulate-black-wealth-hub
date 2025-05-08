
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface MFAVerificationProps {
  factorId: string;
  challengeId: string;
  onVerify: (factorId: string, code: string, challengeId: string) => Promise<any>;
  onCancel: () => void;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({ 
  factorId, 
  challengeId,
  onVerify,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Get the current MFA challenge to check expiry time
    const getMFAChallenge = async () => {
      try {
        // Calculate time remaining based on challenge expiry
        // This is just an estimation since we don't have direct access to when it was created
        // Setting default to 5 minutes (300 seconds)
        setTimeLeft(300);
        
        // Start the countdown
        const countdownInterval = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(countdownInterval);
              setIsExpired(true);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      } catch (error) {
        console.error('Error getting MFA challenge details:', error);
      }
    };

    getMFAChallenge();
  }, [challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("Invalid Code", {
        description: "Please enter a 6-digit verification code"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onVerify(factorId, verificationCode, challengeId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Verification failed');
      }
      
      // The parent component will handle the successful verification
    } catch (error: any) {
      toast.error("Verification Failed", {
        description: error.message || "Invalid verification code. Please try again."
      });
      setVerificationCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isExpired) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verification Expired</CardTitle>
          <CardDescription>
            The verification challenge has expired. Please try logging in again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onCancel}
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          
          <Button
            type="button"
            variant="ghost"
            className="w-full flex items-center justify-center"
            onClick={onCancel}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MFAVerification;
