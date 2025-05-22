
import { useState } from 'react';
import { Factor } from '../types';
import { getMFAFactors, verifyMFA, createMFAChallenge } from '../mfaUtils';

// Function to handle MFA factors
export const useMFAFactors = (userId: string | null) => {
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  
  // Get MFA factors for the current user
  const getMFAFactors = async () => {
    if (!userId) return [];
    
    try {
      const factors = await getMFAFactors(userId);
      setMfaFactors(factors);
      setMfaEnrolled(factors.length > 0);
      return factors;
    } catch (error) {
      console.error('Error fetching MFA factors:', error);
      return [];
    }
  };

  return {
    mfaFactors,
    mfaEnrolled,
    getMFAFactors
  };
};

// Hook for handling MFA challenges
export const useMFAChallenge = () => {
  const [currentMFAChallenge, setCurrentMFAChallenge] = useState<{
    id: string;
    factorId: string;
    expiresAt: string;
  } | null>(null);

  // Get current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  // Create an MFA challenge
  const createChallenge = async (factorId: string) => {
    try {
      const challenge = await createMFAChallenge(factorId);
      if (challenge) {
        setCurrentMFAChallenge({
          id: challenge.id,
          factorId: factorId,
          expiresAt: String(challenge.expires_at)
        });
        return challenge;
      }
      return null;
    } catch (error) {
      console.error('Error creating MFA challenge:', error);
      return null;
    }
  };

  // Verify an MFA challenge
  const verifyMFAChallenge = async (factorId: string, code: string, challengeId: string) => {
    console.log("Verifying MFA:", { factorId, code, challengeId });
    const result = await verifyMFA(factorId, code, challengeId);
    
    // Clear the MFA challenge after verification attempt
    if (result.success) {
      console.log("MFA verification successful");
      setCurrentMFAChallenge(null);
    } else {
      console.error("MFA verification failed:", result);
    }
    
    return result;
  };

  return {
    currentMFAChallenge,
    setCurrentMFAChallenge,
    getCurrentMFAChallenge,
    createChallenge,
    verifyMFA: verifyMFAChallenge
  };
};
