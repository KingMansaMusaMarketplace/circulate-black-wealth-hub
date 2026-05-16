import React from 'react';
import { shouldHidePaymentForTier, shouldHideStripePayments } from '@/utils/platform-utils';
import { IOSWebSubscribeNotice } from '@/components/platform/IOSWebSubscribeNotice';

interface IOSPaymentBlockerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tierName?: string;
  /**
   * Tier ID being offered. When provided and the tier is sold via Apple IAP
   * (e.g. kayla_essentials, kayla_starter), the purchase UI renders on iOS
   * and routes through StoreKit. Without a tier, falls back to blocking all
   * payment UI on iOS (legacy behavior).
   */
  tier?: string;
}

/**
 * Blocks payment-related UI on iOS to comply with Apple's IAP guidelines (3.1.1).
 * For tiers sold via Apple IAP, renders the purchase UI normally on iOS.
 * For web-only tiers (or when no tier is provided), shows the compliant
 * "Subscribe at 1325.ai" notice (no link, no button) by default.
 */
export const IOSPaymentBlocker: React.FC<IOSPaymentBlockerProps> = ({
  children,
  fallback,
  tierName,
  tier,
}) => {
  const hidePayments = tier !== undefined
    ? shouldHidePaymentForTier(tier)
    : shouldHideStripePayments();

  if (hidePayments) {
    return fallback ? <>{fallback}</> : <IOSWebSubscribeNotice tierName={tierName} />;
  }

  return <>{children}</>;
};
