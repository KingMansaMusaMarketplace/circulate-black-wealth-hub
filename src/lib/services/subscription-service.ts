
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export interface CheckoutOptions {
  userType: 'customer' | 'business' | 'corporate';
  email: string;
  name?: string;
  businessName?: string;
  tier?: 'premium' | 'business' | 'enterprise' | 'silver' | 'gold' | 'platinum';
  priceId?: string;
}

export const subscriptionService = {
  /**
   * Create a Stripe checkout session for subscription
   */
  async createCheckoutSession(options: CheckoutOptions): Promise<{ url: string, sessionId: string }> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: options
    });
    
    if (error) {
      console.error('Checkout error:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    return data;
  },

  /**
   * Check current subscription status
   */
  async checkSubscription(): Promise<SubscriptionInfo> {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Subscription check error:', error);
      throw new Error(error.message || 'Failed to check subscription status');
    }
    
    return data as SubscriptionInfo;
  },

  /**
   * Create a Stripe customer portal session for managing subscription
   */
  async createCustomerPortalSession(): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      console.error('Customer portal error:', error);
      throw new Error(error.message || 'Failed to create customer portal session');
    }
    
    return data;
  }
};
