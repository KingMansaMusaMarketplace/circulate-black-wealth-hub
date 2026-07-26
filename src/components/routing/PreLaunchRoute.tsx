import React from 'react';
import { Navigate } from 'react-router-dom';
import { FeatureGate } from '@/components/feature-flags';

interface PreLaunchRouteProps {
  children: React.ReactNode;
  flag?: string;
}

/**
 * PreLaunchRoute
 *
 * Wraps routes that should be hidden during the pre-launch window.
 * When the feature flag is enabled (default), visitors are redirected to the
 * coming-soon page instead of landing on a half-finished module.
 *
 * Usage:
 *   <Route path="/stays" element={<PreLaunchRoute><LazyStaysPage /></PreLaunchRoute>} />
 */
export const PreLaunchRoute: React.FC<PreLaunchRouteProps> = ({
  children,
  flag = 'pre_launch_hide_risky_modules',
}) => {
  return (
    <FeatureGate
      flag={flag}
      inverted
      fallback={<Navigate to="/coming-soon" replace />}
    >
      {children}
    </FeatureGate>
  );
};

export default PreLaunchRoute;
