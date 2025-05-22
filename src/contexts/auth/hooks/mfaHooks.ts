
import { setupMFA } from '../mfaUtils';
import { useState, useCallback } from 'react';

export const useMFASetup = (userId: string | null) => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const setupMFAForUser = useCallback(async () => {
    if (!userId) {
      throw new Error("User must be logged in to setup MFA");
    }
    setIsSettingUp(true);
    try {
      const result = await setupMFA(userId);
      return result;
    } finally {
      setIsSettingUp(false);
    }
  }, [userId]);
  
  return {
    isSettingUp,
    setupMFAForUser
  };
};
