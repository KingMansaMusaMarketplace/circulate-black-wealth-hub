
import React from 'react';
import MFAVerification from '@/components/auth/mfa/MFAVerification';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface MFAHandlerProps {
  mfaData: { factorId: string, challengeId: string } | null;
  showMFAVerification: boolean;
  onCancel: () => void;
}

export const MFAHandler: React.FC<MFAHandlerProps> = ({ 
  mfaData, 
  showMFAVerification, 
  onCancel 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { verifyMFA } = useAuth();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as any)?.from || '/dashboard';

  const handleMFAVerify = async (factorId: string, code: string, challengeId: string) => {
    try {
      const result = await verifyMFA(factorId, code, challengeId);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'MFA verification failed');
      }
      
      toast({
        title: 'Verification Successful',
        description: 'You have been successfully logged in',
      });
      
      // Navigate to the page they were trying to access or dashboard
      navigate(from, { replace: true });
      
      return result;
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  if (showMFAVerification && mfaData) {
    return (
      <MFAVerification 
        factorId={mfaData.factorId}
        challengeId={mfaData.challengeId}
        onVerify={handleMFAVerify}
        onCancel={onCancel}
      />
    );
  }

  return null;
};
