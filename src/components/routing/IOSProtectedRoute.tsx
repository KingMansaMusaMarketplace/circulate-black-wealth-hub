import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCapacitor } from '@/hooks/use-capacitor';

interface IOSProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper component that redirects iOS users away from blocked features
 * (business registration, subscriptions, payments) per App Store guidelines
 */
const IOSProtectedRoute: React.FC<IOSProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/ios-blocked' 
}) => {
  const { platform } = useCapacitor();
  const isIOS = platform === 'ios';

  if (isIOS) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default IOSProtectedRoute;
