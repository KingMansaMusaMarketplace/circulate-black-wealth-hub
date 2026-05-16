import React from 'react';
import type { RealWorldService } from '@/utils/platform-utils';

interface RealWorldServiceGateProps {
  /** Which real-world service this payment UI is for (rideshare, lodging, etc.) */
  service: RealWorldService;
  children: React.ReactNode;
}

/**
 * Explicit marker for Stripe payment UI tied to real-world services
 * (Noire Rideshare, Mansa Stays). Always renders children on every platform
 * including iOS, per Apple Guideline 3.1.5(a) — these are physical/real-world
 * services consumed outside the app, so Stripe is required and Apple takes 0%.
 *
 * Use this instead of bare children at booking call sites so reviewers and
 * future code see the iOS-allowed intent clearly. Do NOT use for digital
 * subscriptions (use Apple IAP) or for QR loyalty / sponsorship checkout
 * (digital — must stay web-only on iOS).
 */
export const RealWorldServiceGate: React.FC<RealWorldServiceGateProps> = ({ children }) => {
  return <>{children}</>;
};
