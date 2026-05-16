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

/**
 * Tiers sold via Apple In-App Purchase on iOS.
 * These tiers SHOW a purchase button on iOS (routed through StoreKit).
 * All other paid tiers remain web-only on iOS.
 */
export const APPLE_IAP_TIERS = new Set<string>([
  'kayla_essentials',
  'kayla_starter',
]);

export const isAppleIAPTier = (tier?: string | null): boolean => {
  return !!tier && APPLE_IAP_TIERS.has(tier);
};

/**
 * Legacy: hides ALL Stripe payment UI on iOS.
 * Use shouldHidePaymentForTier(tier) when you know the tier — that allows
 * Apple IAP tiers to render their purchase button on iOS.
 */
export const shouldHideStripePayments = (): boolean => {
  return isIOSPlatform();
};

/**
 * Tier-aware: returns false on iOS for tiers sold via Apple IAP,
 * so their purchase UI renders and routes through StoreKit.
 * Returns true on iOS for any other paid tier (web-only).
 */
export const shouldHidePaymentForTier = (tier?: string | null): boolean => {
  if (!isIOSPlatform()) return false;
  if (isAppleIAPTier(tier)) return false;
  return true;
};

export const getPlatformName = (): string => {
  return Capacitor.getPlatform();
};
