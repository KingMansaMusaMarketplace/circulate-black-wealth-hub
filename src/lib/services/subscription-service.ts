
import { supabase } from '@/lib/supabase';

export interface SubscriptionInfo {
  isActive: boolean;
  tier: 'free' | 'paid' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export const subscriptionService = {
  async checkSubscription(): Promise<SubscriptionInfo> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user profile to check subscription status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, subscription_start_date, subscription_end_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Default to free tier if no profile
      if (!profile) {
        return {
          isActive: true,
          tier: 'free',
          status: 'active'
        };
      }

      return {
        isActive: profile.subscription_status === 'active',
        tier: profile.subscription_tier || 'free',
        status: profile.subscription_status || 'active',
        currentPeriodStart: profile.subscription_start_date,
        currentPeriodEnd: profile.subscription_end_date
      };
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Return default free tier on error
      return {
        isActive: true,
        tier: 'free',
        status: 'active'
      };
    }
  },

  async createCustomerPortalSession(): Promise<{ url: string }> {
    try {
      // This would typically call a Stripe customer portal endpoint
      // For now, return a placeholder
      return { url: '/subscription' };
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      throw error;
    }
  }
};
