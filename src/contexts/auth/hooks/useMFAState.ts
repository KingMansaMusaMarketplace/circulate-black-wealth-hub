
import { useState } from 'react';
import { Factor, MFAChallenge } from '../types';
import { getMFAFactors as fetchMFAFactors } from '../mfaUtils';

export const useMFAState = () => {
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [currentMFAChallenge, setCurrentMFAChallenge] = useState<MFAChallenge | null>(null);

  // Get MFA factors for the current user
  const getMFAFactors = async (userId?: string): Promise<Factor[]> => {
    if (!userId) return [];
    
    try {
      const factors = await fetchMFAFactors(userId);
      setMfaFactors(factors);
      setMfaEnrolled(factors.length > 0);
      
      return factors;
    } catch (error) {
      console.error('Error in getMFAFactors:', error);
      return [];
    }
  };

  // Get the current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  return {
    mfaFactors,
    mfaEnrolled,
    currentMFAChallenge,
    setCurrentMFAChallenge,
    getMFAFactors,
    getCurrentMFAChallenge
  };
};
