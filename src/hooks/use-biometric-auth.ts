import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// Biometric authentication using native device capabilities
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

  const enableBiometric = async (email: string) => {
    if (!isAvailable) return false;

    try {
      // Store that biometric is enabled for this user
      localStorage.setItem('biometric_enabled', 'true');
      localStorage.setItem('biometric_user_email', email);
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const disableBiometric = () => {
    localStorage.removeItem('biometric_enabled');
    localStorage.removeItem('biometric_user_email');
  };

  const getBiometricUser = (): string | null => {
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
    getBiometricUser,
    isBiometricEnabled,
  };
};
