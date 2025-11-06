import React, { createContext, useContext, useEffect } from 'react';
import posthog from 'posthog-js';

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  identifyUser: (userId: string, properties?: Record<string, any>) => void;
  trackPageView: (pageName: string, properties?: Record<string, any>) => void;
  trackConversion: (conversionType: string, value?: number, properties?: Record<string, any>) => void;
  resetUser: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize PostHog
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
    
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthog) => {
          if (import.meta.env.DEV) {
            console.log('[Analytics] PostHog initialized');
          }
        },
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
      });
    } else if (import.meta.env.DEV) {
      console.warn('[Analytics] PostHog key not found. Analytics disabled.');
    }
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    try {
      posthog.capture(eventName, properties);
      if (import.meta.env.DEV) {
        console.log('[Analytics] Event:', eventName, properties);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    try {
      posthog.identify(userId, properties);
      if (import.meta.env.DEV) {
        console.log('[Analytics] User identified:', userId, properties);
      }
    } catch (error) {
      console.error('[Analytics] Error identifying user:', error);
    }
  };

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    try {
      posthog.capture('$pageview', { page_name: pageName, ...properties });
      if (import.meta.env.DEV) {
        console.log('[Analytics] Page view:', pageName, properties);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking page view:', error);
    }
  };

  const trackConversion = (conversionType: string, value?: number, properties?: Record<string, any>) => {
    try {
      posthog.capture('conversion', {
        conversion_type: conversionType,
        value,
        ...properties
      });
      if (import.meta.env.DEV) {
        console.log('[Analytics] Conversion:', conversionType, value, properties);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking conversion:', error);
    }
  };

  const resetUser = () => {
    try {
      posthog.reset();
      if (import.meta.env.DEV) {
        console.log('[Analytics] User reset');
      }
    } catch (error) {
      console.error('[Analytics] Error resetting user:', error);
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        identifyUser,
        trackPageView,
        trackConversion,
        resetUser,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};
