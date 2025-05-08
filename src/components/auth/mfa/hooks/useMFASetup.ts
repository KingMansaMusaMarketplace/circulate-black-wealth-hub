
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMFASetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, getMFAFactors } = useAuth();

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (user) {
        const factors = await getMFAFactors();
        setIsEnrolled(factors.length > 0);
      }
    };

    checkMFAStatus();
  }, [user, getMFAFactors]);

  const startMFAEnrollment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Mansa Musa Marketplace'
      });

      if (error) throw error;

      if (data) {
        setQrCodeUrl(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
      }
    } catch (error: any) {
      console.error('Error starting MFA enrollment:', error);
      setError(error.message || 'Failed to start MFA enrollment');
      toast.error("MFA Setup Failed", {
        description: error.message || 'An error occurred while setting up MFA'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!factorId || !verificationCode) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId
      });

      if (error) throw error;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code: verificationCode
      });

      if (verifyError) throw verifyError;

      // Update enrolled status
      setIsEnrolled(true);
      setQrCodeUrl(null);
      setSecret(null);
      setFactorId(null);
      setVerificationCode('');
      
      toast.success("MFA Enabled", {
        description: 'Two-factor authentication has been successfully enabled'
      });
      
      // Refresh MFA factors
      await getMFAFactors();
    } catch (error: any) {
      console.error('Error verifying MFA:', error);
      setError(error.message || 'Failed to verify code');
      toast.error("Verification Failed", {
        description: error.message || 'Invalid verification code'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableMFA = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const factors = await getMFAFactors();
      
      if (factors.length > 0) {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId: factors[0].id
        });

        if (error) throw error;

        // Update enrolled status
        setIsEnrolled(false);
        toast.success("MFA Disabled", {
          description: 'Two-factor authentication has been disabled'
        });
        
        // Refresh MFA factors
        await getMFAFactors();
      }
    } catch (error: any) {
      console.error('Error disabling MFA:', error);
      setError(error.message || 'Failed to disable MFA');
      toast.error("Error Disabling MFA", {
        description: error.message || 'An error occurred while disabling MFA'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    qrCodeUrl,
    secret,
    factorId,
    verificationCode,
    setVerificationCode,
    isEnrolled,
    error,
    startMFAEnrollment,
    verifyAndEnableMFA,
    disableMFA
  };
};
