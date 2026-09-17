
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import MFAVerification from '@/components/auth/mfa/MFAVerification';

interface MFAHandlerProps {
  mfaData: {
    factorId: string;
    challengeId: string;
  };
  showMFAVerification: boolean;
  onCancel: () => void;
}

const MFAHandler: React.FC<MFAHandlerProps> = ({ 
  mfaData,
  showMFAVerification, 
  onCancel
}) => {
  const { verifyMFA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from ?next=/?redirect= query, location state, or default
  const searchParams = new URLSearchParams(location.search);
  const target = searchParams.get('next') || searchParams.get('redirect');
  const safeTarget = target && target.startsWith('/') && !target.startsWith('//') ? target : null;
  const from = safeTarget || (location.state as any)?.from || '/dashboard';

  const handleMFASubmit = async (code: string) => {
    try {
      const result = await verifyMFA(mfaData.factorId, code, mfaData.challengeId);
      
      if (result.success) {
        toast.success('Authentication successful!');
        // Navigate to the destination after successful MFA verification
        navigate(from, { replace: true });
        return true;
      } else {
        toast.error('Invalid verification code', {
          description: 'Please try again with a correct code.'
        });
        return false;
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Failed to verify code', {
        description: 'There was an error verifying your code. Please try again.'
      });
      return false;
    }
  };

  if (!showMFAVerification) return null;

  return (
    <MFAVerification
      factorId={mfaData.factorId}
      challengeId={mfaData.challengeId}
      onVerify={handleMFASubmit}
      onCancel={onCancel}
    />
  );
};

export { MFAHandler };
