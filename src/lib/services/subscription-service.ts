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

  createCheckoutSession: async (options: {
    userType: 'customer' | 'business' | 'corporate';
    email: string;
    name: string;
    businessName?: string;
    tier?: string;
    companyName?: string;
    phone?: string;
    message?: string;
    // New sponsor-specific fields
    contactTitle?: string;
    companyAddress?: string;
    companyCity?: string;
    companyState?: string;
    companyZipCode?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
  }) => {
    try {
      console.log('Creating checkout session with options:', options);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userType: options.userType,
          email: options.email,
          name: options.name,
          businessName: options.businessName,
          tier: options.tier || 'premium',
          // Include all sponsor-specific fields
          companyName: options.companyName,
          phone: options.phone,
          message: options.message,
          contactTitle: options.contactTitle,
          companyAddress: options.companyAddress,
          companyCity: options.companyCity,
          companyState: options.companyState,
          companyZipCode: options.companyZipCode,
          companyWebsite: options.companyWebsite,
          industry: options.industry,
          companySize: options.companySize
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }

      if (!data?.url) {
        console.error('No checkout URL returned:', data);
        throw new Error('No checkout URL returned from payment service');
      }

      console.log('Checkout session created successfully:', data.url);
      return data;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      throw error;
    }
  }
};
