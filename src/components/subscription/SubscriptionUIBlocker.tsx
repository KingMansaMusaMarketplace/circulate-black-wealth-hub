import React from 'react';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { IOSWebSubscribeNotice } from '@/components/platform/IOSWebSubscribeNotice';

interface SubscriptionUIBlockerProps {
  children: React.ReactNode;
  /** Optional tier name to personalize the iOS notice */
  tierName?: string;
  /** If true, render nothing on iOS (legacy behavior) instead of the notice */
  silent?: boolean;
}

/**
 * On iOS, replaces subscription UI with a compliant notice directing users
 * to subscribe at 1325.ai (no links, no buttons — Apple Guideline 3.1.1).
 * On other platforms, renders children normally.
 */
export const SubscriptionUIBlocker: React.FC<SubscriptionUIBlockerProps> = ({
  children,
  tierName,
  silent = false,
}) => {
  const hideOnIOS = shouldHideStripePayments();

  if (hideOnIOS) {
    return silent ? null : <IOSWebSubscribeNotice tierName={tierName} />;
  }

  return <>{children}</>;
};
