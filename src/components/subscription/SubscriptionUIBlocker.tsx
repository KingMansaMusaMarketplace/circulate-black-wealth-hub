import React from 'react';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface SubscriptionUIBlockerProps {
  children: React.ReactNode;
}

/**
 * Component that completely hides subscription UI on iOS
 * Returns null (renders nothing) when on iOS platform
 * 
 * Use this to wrap ANY subscription-related UI components
 */
export const SubscriptionUIBlocker: React.FC<SubscriptionUIBlockerProps> = ({ children }) => {
  const hideOnIOS = shouldHideStripePayments();
  
  // On iOS, render nothing - completely hide all subscription UI
  if (hideOnIOS) {
    return null;
  }
  
  // On other platforms, show the subscription UI
  return <>{children}</>;
};
