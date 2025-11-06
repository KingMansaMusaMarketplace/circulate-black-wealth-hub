import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Component that automatically tracks route changes and user sessions
 */
export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const { trackPageView, identifyUser, resetUser } = useAnalytics();
  const { user } = useAuth();

  // Track user identity
  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        email: user.email,
        created_at: user.created_at,
      });
    } else {
      resetUser();
    }
  }, [user, identifyUser, resetUser]);

  // Track page views on route change
  useEffect(() => {
    const pageName = location.pathname;
    trackPageView(pageName, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    });
  }, [location, trackPageView]);

  return null;
};
