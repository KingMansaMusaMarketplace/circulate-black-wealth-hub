
import { useState } from 'react';
import { setupMFA as setupMFAUtil } from './mfaUtils';

export const useMFASetup = (userId: string | null) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{ qrCode?: string, secret?: string, factorId?: string } | null>(null);

  const setupMFAForUser = async () => {
    if (!userId) {
      console.error('Cannot set up MFA: No user ID provided');
      return '';
    }
    
    try {
      setIsEnrolling(true);
      const factorId = await setupMFAUtil(userId);
      
      if (factorId) {
        // Here we would normally set the enrollment data with QR code
        setEnrollmentData({
          factorId,
          // Add other data as needed from the setupMFA response
        });
      }
      
      return factorId;
    } catch (error) {
      console.error('Error setting up MFA:', error);
      return '';
    } finally {
      setIsEnrolling(false);
    }
  };

  const resetEnrollment = () => {
    setEnrollmentData(null);
  };

  return {
    isEnrolling,
    enrollmentData,
    setupMFAForUser,
    resetEnrollment
  };
};
