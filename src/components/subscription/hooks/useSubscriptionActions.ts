
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
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (tier === 'free') {
      toast.info('You are already on the free plan');
      onPlanSelect?.(tier);
      return;
    }

    setLoading(tier);
    try {
      // Map tier to appropriate userType
      const userType = (tier === 'business' || tier === 'enterprise') ? 'business' : 'customer';
      
      console.log('Creating checkout session for:', { tier, userType, email: user.email });
      
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: userType,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        tier: tier,
      });
      
      console.log('Checkout session created:', checkoutData);
      
      // Open checkout in new tab
      window.open(checkoutData.url, '_blank');
      
      // Refresh subscription after a delay to check for updates
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
      
      toast.success('Redirecting to checkout...');
      onPlanSelect?.(tier);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start subscription process';
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    handleSubscribe
  };
};
