import React from 'react';
import { useFeatureFlags } from '@/hooks/use-feature-flags';

interface FeatureGateProps {
  /**
   * The feature flag key to check
   */
  flag: string;
  
  /**
   * Content to render when the flag is enabled
   */
  children: React.ReactNode;
  
  /**
   * Optional content to render when the flag is disabled
   * If not provided, nothing will be rendered
   */
  fallback?: React.ReactNode;
  
  /**
   * If true, shows children while loading
   * If false, shows nothing while loading
   * Default: false
   */
  showWhileLoading?: boolean;
  
  /**
   * Optional loading component to show while fetching flags
   */
  loadingFallback?: React.ReactNode;
  
  /**
   * Inverts the logic - shows children when flag is DISABLED
   * Useful for hiding deprecated features
   */
  inverted?: boolean;
}

/**
 * FeatureGate Component
 * 
 * A conditional rendering wrapper that shows/hides content based on feature flag state.
 * 
 * Basic Usage:
 * ```tsx
 * <FeatureGate flag="new_dashboard">
 *   <NewDashboard />
 * </FeatureGate>
 * ```
 * 
 * With Fallback:
 * ```tsx
 * <FeatureGate flag="beta_checkout" fallback={<OldCheckout />}>
 *   <NewCheckout />
 * </FeatureGate>
 * ```
 * 
 * Inverted (show when disabled):
 * ```tsx
 * <FeatureGate flag="hide_legacy_feature" inverted>
 *   <LegacyFeature />
 * </FeatureGate>
 * ```
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  flag,
  children,
  fallback = null,
  showWhileLoading = false,
  loadingFallback = null,
  inverted = false,
}) => {
  const { isEnabled, isLoading } = useFeatureFlags();

  // Handle loading state
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    if (showWhileLoading) {
      return <>{children}</>;
    }
    return null;
  }

  // Check if flag is enabled
  const flagEnabled = isEnabled(flag);
  const shouldShowChildren = inverted ? !flagEnabled : flagEnabled;

  if (shouldShowChildren) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

/**
 * Higher-Order Component version of FeatureGate
 * 
 * Usage:
 * ```tsx
 * const NewDashboard = () => <div>New Dashboard</div>;
 * const GatedNewDashboard = withFeatureGate(NewDashboard, 'new_dashboard');
 * ```
 */
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  flag: string,
  FallbackComponent?: React.ComponentType<P>
) {
  return function GatedComponent(props: P) {
    return (
      <FeatureGate 
        flag={flag} 
        fallback={FallbackComponent ? <FallbackComponent {...props} /> : null}
      >
        <Component {...props} />
      </FeatureGate>
    );
  };
}

export default FeatureGate;
