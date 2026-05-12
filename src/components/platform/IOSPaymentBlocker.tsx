import React from 'react';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { IOSWebSubscribeNotice } from '@/components/platform/IOSWebSubscribeNotice';

interface IOSPaymentBlockerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tierName?: string;
}

/**
 * Blocks payment-related UI on iOS to comply with Apple's IAP guidelines (3.1.1).
 * Shows compliant "Subscribe at 1325.ai" notice (no link, no button) by default.
 */
export const IOSPaymentBlocker: React.FC<IOSPaymentBlockerProps> = ({
  children,
  fallback,
  tierName,
}) => {
  const hidePayments = shouldHideStripePayments();

  if (hidePayments) {
    return fallback ? <>{fallback}</> : <IOSWebSubscribeNotice tierName={tierName} />;
  }

  return <>{children}</>;
};
