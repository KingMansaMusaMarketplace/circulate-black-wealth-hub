
import { useState } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { useConversionTracking } from '@/hooks/use-analytics-tracking';
import { appleIAPService, APPLE_PRODUCT_IDS } from '@/lib/services/apple-iap-service';

interface UseSubscriptionActionsProps {
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

export const useSubscriptionActions = ({ onPlanSelect }: UseSubscriptionActionsProps = {}) => {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { platform } = useCapacitor();
  const { trackSubscriptionView, trackSubscriptionStart, trackSubscriptionComplete } = useConversionTracking();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const isIOS = platform === 'ios';

  const handleSubscribe = async (tier: SubscriptionTier) => {
    console.log('[SUBSCRIPTION] Subscribe button clicked for tier:', tier);
    console.log('[SUBSCRIPTION] Platform:', platform, 'isIOS:', isIOS);
    console.log('[SUBSCRIPTION] Current user:', user);
    
    // Wait briefly for auth state to fully propagate
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user) {
      console.log('[SUBSCRIPTION] No user found, showing signup/login options');
      sessionStorage.setItem('pendingSubscription', tier);
      
      toast.error('Account Required', {
        description: 'Create an account or log in to purchase this subscription.',
        duration: 6000,
        action: {
          label: 'Sign Up',
          onClick: () => {
            window.location.href = '/signup';
          }
        }
      });
      
      setTimeout(() => {
        toast.info('Already have an account?', {
          duration: 5000,
          action: {
            label: 'Log In',
            onClick: () => {
              window.location.href = '/login';
            }
          }
        });
      }, 500);
      
      return;
    }

    if (tier === 'free') {
      console.log('[SUBSCRIPTION] Free tier selected');
      trackSubscriptionView(tier);
      toast.info('You are already on the free plan');
      onPlanSelect?.(tier);
      return;
    }

    sessionStorage.removeItem('pendingSubscription');

    console.log('[SUBSCRIPTION] Starting subscription process');
    trackSubscriptionStart(tier);
    setLoading(tier);
    
    try {
      // iOS: Use Apple IAP
      if (isIOS) {
        console.log('[SUBSCRIPTION] Using Apple IAP for iOS');
        
        const productIdMap: Record<string, string> = {
          'premium': APPLE_PRODUCT_IDS.PREMIUM,
          'business': APPLE_PRODUCT_IDS.BUSINESS_BASIC,
          'enterprise': APPLE_PRODUCT_IDS.BUSINESS_ENTERPRISE,
        };

        const productId = productIdMap[tier];
        if (!productId) {
          toast.error('This subscription tier is not available on iOS');
          return;
        }

        await appleIAPService.purchase(productId as any);
        
        setTimeout(() => {
          refreshSubscription();
        }, 2000);
        
        onPlanSelect?.(tier);
        return;
      }

      // Web: Use Stripe
      console.log('[SUBSCRIPTION] Using Stripe for web');
      const userType = (tier === 'business' || tier === 'enterprise') ? 'business' : 'customer';
      
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        tier,
      });
      
      console.log('Checkout session created:', checkoutData);
      
      if (checkoutData.url) {
        console.log('Opening checkout URL in new tab');
        window.open(checkoutData.url, '_blank');
        
        setTimeout(() => {
          console.log('Refreshing subscription status');
          refreshSubscription();
        }, 2000);
        
        toast.success('Redirecting to checkout...');
        onPlanSelect?.(tier);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error in subscription flow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start subscription process';
      toast.error(`Subscription error: ${errorMessage}`);
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    handleSubscribe,
    isAuthenticated: !!user
  };
};
