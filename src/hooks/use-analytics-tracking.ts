import { useEffect } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to automatically track user properties and session data
 */
export const useAnalyticsTracking = () => {
  const { identifyUser } = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      identifyUser(user.id, {
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      });
    }
  }, [user, identifyUser]);
};

/**
 * Hook to track page views automatically
 */
export const usePageTracking = (pageName: string, properties?: Record<string, any>) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName, properties);
  }, [pageName, trackPageView]);
};

/**
 * Hook to track business metrics
 */
export const useBusinessMetrics = () => {
  const { trackEvent } = useAnalytics();

  const trackBusinessAction = (action: string, businessId: string, properties?: Record<string, any>) => {
    trackEvent(`business_${action}`, {
      business_id: businessId,
      ...properties
    });
  };

  return {
    trackBusinessView: (businessId: string) => trackBusinessAction('view', businessId),
    trackBusinessClick: (businessId: string) => trackBusinessAction('click', businessId),
    trackBusinessSearch: (query: string, resultsCount: number) => 
      trackEvent('business_search', { query, results_count: resultsCount }),
    trackQRCodeScan: (businessId: string, pointsEarned: number) => 
      trackEvent('qr_code_scan', { business_id: businessId, points_earned: pointsEarned }),
    trackRewardRedeem: (businessId: string, rewardValue: number) =>
      trackEvent('reward_redeem', { business_id: businessId, reward_value: rewardValue }),
  };
};

/**
 * Hook to track conversion funnels
 */
export const useConversionTracking = () => {
  const { trackEvent, trackConversion } = useAnalytics();

  return {
    // User onboarding funnel
    trackSignupStart: () => trackEvent('signup_start'),
    trackSignupComplete: (userId: string) => {
      trackEvent('signup_complete', { user_id: userId });
      trackConversion('signup', undefined, { user_id: userId });
    },
    trackEmailVerified: () => trackEvent('email_verified'),
    
    // Business onboarding funnel
    trackBusinessRegistrationStart: () => trackEvent('business_registration_start'),
    trackBusinessRegistrationComplete: (businessId: string) => {
      trackEvent('business_registration_complete', { business_id: businessId });
      trackConversion('business_registration', undefined, { business_id: businessId });
    },
    
    // Subscription funnel
    trackSubscriptionView: (tier: string) => trackEvent('subscription_view', { tier }),
    trackSubscriptionStart: (tier: string) => trackEvent('subscription_start', { tier }),
    trackSubscriptionComplete: (tier: string, amount: number) => {
      trackEvent('subscription_complete', { tier, amount });
      trackConversion('subscription', amount, { tier });
    },
    
    // Transaction funnel
    trackTransactionStart: (amount: number) => trackEvent('transaction_start', { amount }),
    trackTransactionComplete: (transactionId: string, amount: number) => {
      trackEvent('transaction_complete', { transaction_id: transactionId, amount });
      trackConversion('transaction', amount, { transaction_id: transactionId });
    },
    
    // Engagement funnel
    trackQRScanFunnelStart: () => trackEvent('qr_scan_funnel_start'),
    trackQRScanFunnelComplete: (pointsEarned: number) => {
      trackEvent('qr_scan_funnel_complete', { points_earned: pointsEarned });
      trackConversion('qr_scan', pointsEarned);
    },
  };
};
