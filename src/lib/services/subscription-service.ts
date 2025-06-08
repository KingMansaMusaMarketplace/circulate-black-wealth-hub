
import { supabase } from '@/lib/supabase';

export interface SubscriptionInfo {
  isActive: boolean;
  tier: 'free' | 'paid' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  subscription_tier?: 'free' | 'premium' | 'business' | 'enterprise';
  subscription_end?: string;
  subscribed?: boolean;
}

export const subscriptionService = {
  async checkSubscription(): Promise<SubscriptionInfo> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        // Return default free tier on error
        return {
          isActive: true,
          tier: 'free',
          status: 'active',
          subscription_tier: 'free'
        };
      }

      return {
        isActive: data.subscribed || false,
        tier: data.subscription_tier || 'free',
        status: data.subscribed ? 'active' : 'canceled',
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end,
        subscribed: data.subscribed || false
      };
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Return default free tier on error
      return {
        isActive: true,
        tier: 'free',
        status: 'active',
        subscription_tier: 'free'
      };
    }
  },

  async createCustomerPortalSession(): Promise<{ url: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      return { url: data.url };
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      throw error;
    }
  },

  async createCheckoutSession(options: {
    userType: string;
    email: string;
    name: string;
    tier?: string;
    businessName?: string;
  }): Promise<{ url: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: options,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      return { url: data.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
};
