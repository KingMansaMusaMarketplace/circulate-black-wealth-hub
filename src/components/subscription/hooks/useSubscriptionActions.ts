
import { useState } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

interface UseSubscriptionActionsProps {
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

export const useSubscriptionActions = ({ onPlanSelect }: UseSubscriptionActionsProps = {}) => {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    console.log('Subscribe button clicked for tier:', tier);
    console.log('Current user from auth context:', user);
    
    if (!user) {
      console.log('No user found, showing error');
      toast.error('Please log in to subscribe');
      return;
    }

    if (tier === 'free') {
      console.log('Free tier selected');
      toast.info('You are already on the free plan');
      onPlanSelect?.(tier);
      return;
    }

    console.log('Starting subscription process for:', { tier, userEmail: user.email });
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
    handleSubscribe
  };
};
