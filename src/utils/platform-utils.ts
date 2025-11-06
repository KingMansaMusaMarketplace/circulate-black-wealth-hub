import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities for iOS compliance
 */

export const isIOSPlatform = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const shouldHideStripePayments = (): boolean => {
  // Hide Stripe payments on iOS to comply with Apple's IAP guidelines
  return isIOSPlatform();
};

export const getPlatformName = (): string => {
  return Capacitor.getPlatform();
};
