
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseMFAVerificationProps {
  factorId: string;
  challengeId: string;
  onVerify: (factorId: string, code: string, challengeId: string) => Promise<any>;
}

export const useMFAVerification = ({ 
  factorId, 
  challengeId, 
  onVerify 
}: UseMFAVerificationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Set default to 5 minutes (300 seconds)
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
  }, [challengeId]);

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      toast.error("Invalid Code", {
        description: "Please enter a 6-digit verification code"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onVerify(factorId, code, challengeId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Verification failed');
      }
      
      // The parent component will handle the successful verification
    } catch (error: any) {
      toast.error("Verification Failed", {
        description: error.message || "Invalid verification code. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    timeLeft,
    isExpired,
    handleVerify,
  };
};
