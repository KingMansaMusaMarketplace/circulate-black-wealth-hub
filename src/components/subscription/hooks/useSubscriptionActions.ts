
import { useState } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { useConversionTracking } from '@/hooks/use-analytics-tracking';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface UseSubscriptionActionsProps {
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

export const useSubscriptionActions = ({ onPlanSelect }: UseSubscriptionActionsProps = {}) => {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { trackSubscriptionView, trackSubscriptionStart, trackSubscriptionComplete } = useConversionTracking();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    // Block Stripe payments on iOS (Apple IAP compliance)
    if (shouldHideStripePayments()) {
      toast.error('Payment features are not available in the iOS app. Please visit our website to subscribe.');
      return;
    }

    console.log('[SUBSCRIPTION] Subscribe button clicked for tier:', tier);
    console.log('[SUBSCRIPTION] Current user from auth context:', user);
    console.log('[SUBSCRIPTION] User email:', user?.email);
    console.log('[SUBSCRIPTION] User ID:', user?.id);
    
    // Wait briefly for auth state to fully propagate (increased timeout for iOS)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user) {
      console.log('[SUBSCRIPTION] No user found after check, showing signup/login options');
      
      // Store intended subscription tier for after login/signup
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
      
      // Show a second toast with login option after a delay
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

    // Clear any pending subscription since we're processing now
    sessionStorage.removeItem('pendingSubscription');

    console.log('[SUBSCRIPTION] Starting subscription process for:', { tier, userEmail: user.email, userId: user.id });
    trackSubscriptionStart(tier);
    setLoading(tier);
    
    try {
      // Map tier to appropriate userType for the checkout session
      const userType = (tier === 'business' || tier === 'enterprise') ? 'business' : 'customer';
      
      console.log('Creating checkout session with params:', {
        userType,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        tier: tier,
      });
      
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: userType,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        tier: tier,
      });
      
      console.log('Checkout session created successfully:', checkoutData);
      
      if (checkoutData.url) {
        // Open checkout in new tab
        console.log('Opening checkout URL in new tab');
        window.open(checkoutData.url, '_blank');
        
        // Refresh subscription after a delay to check for updates
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
      console.error('Error creating checkout session:', error);
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
