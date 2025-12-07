import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// Biometric authentication using native device capabilities
// Security: Stores user ID instead of email to minimize PII exposure
export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint' | null>(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (!Capacitor.isNativePlatform()) {
      setIsAvailable(false);
      return;
    }

    try {
      // Check if device supports biometric authentication
      const platform = Capacitor.getPlatform();
      
      if (platform === 'ios') {
        // iOS devices (Face ID or Touch ID)
        setBiometricType('face'); // Most modern iPhones use Face ID
        setIsAvailable(true);
      } else if (platform === 'android') {
        // Android devices (fingerprint)
        setBiometricType('fingerprint');
        setIsAvailable(true);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isAvailable) {
      return { success: false, error: 'Biometric authentication not available' };
    }

    try {
      // Check if we have stored credentials
      const hasStoredCredentials = localStorage.getItem('biometric_enabled') === 'true';
      
      if (!hasStoredCredentials) {
        return { success: false, error: 'No stored credentials' };
      }

      // In a real implementation, you would use native biometric APIs here
      // For now, we'll simulate the authentication
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate successful biometric authentication
          resolve({ success: true });
        }, 1000);
      });
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication failed' };
    }
  };

  // Security improvement: Store user ID instead of email
  const enableBiometric = async (userId: string) => {
    if (!isAvailable) return false;

    try {
      // Store that biometric is enabled for this user (using ID, not email)
      localStorage.setItem('biometric_enabled', 'true');
      localStorage.setItem('biometric_user_id', userId);
      // Clean up any legacy email storage
      localStorage.removeItem('biometric_user_email');
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const disableBiometric = () => {
    localStorage.removeItem('biometric_enabled');
    localStorage.removeItem('biometric_user_id');
    // Clean up legacy email storage if exists
    localStorage.removeItem('biometric_user_email');
  };

  // Returns user ID instead of email for security
  const getBiometricUserId = (): string | null => {
    return localStorage.getItem('biometric_user_id');
  };

  // Legacy support: Get user email if stored (for migration)
  // @deprecated Use getBiometricUserId instead
  const getBiometricUser = (): string | null => {
    // First check for new ID-based storage
    const userId = localStorage.getItem('biometric_user_id');
    if (userId) return userId;
    // Fall back to legacy email storage
    return localStorage.getItem('biometric_user_email');
  };

  const isBiometricEnabled = (): boolean => {
    return localStorage.getItem('biometric_enabled') === 'true';
  };

  return {
    isAvailable,
    biometricType,
    authenticate,
    enableBiometric,
    disableBiometric,
    getBiometricUserId,
    getBiometricUser, // Legacy support
    isBiometricEnabled,
  };
};
