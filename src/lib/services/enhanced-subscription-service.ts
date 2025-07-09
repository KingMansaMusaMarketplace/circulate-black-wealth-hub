
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

export interface SubscriptionData {
  userType: 'customer' | 'business' | 'corporate';
  email: string;
  name: string;
  businessName?: string;
  tier?: string;
  phone?: string;
  priceId?: string;
}

export const enhancedSubscriptionService = {
  // Create a checkout session with enhanced error handling and logging
  async createCheckoutSession(subscriptionData: SubscriptionData): Promise<PaymentResult> {
    try {
      console.log('Creating checkout session with data:', subscriptionData);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // For non-authenticated users, we can still create checkout sessions
        console.log('No active session, creating guest checkout');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: subscriptionData,
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`,
        } : {},
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Payment service error: ${error.message}`);
      }

      if (!data?.url) {
        console.error('No checkout URL returned:', data);
        throw new Error('Payment service did not return a checkout URL');
      }

      console.log('Checkout session created successfully:', data);
      return {
        success: true,
        sessionId: data.sessionId,
        url: data.url
      };
    } catch (error) {
      console.error('Enhanced subscription service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  },

  // Enhanced subscription checking with better error handling
  async checkSubscriptionStatus(): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {
          subscribed: false,
          subscription_tier: 'free',
          error: 'Not authenticated'
        };
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return {
          subscribed: false,
          subscription_tier: 'free',
          error: error.message
        };
      }

      return data;
    } catch (error) {
      console.error('Subscription check failed:', error);
      return {
        subscribed: false,
        subscription_tier: 'free',
        error: 'Failed to check subscription status'
      };
    }
  },

  // Open customer portal with enhanced error handling
  async openCustomerPortal(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to manage your subscription');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Customer portal error:', error);
        toast.error('Failed to open customer portal');
        return false;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        return true;
      }

      toast.error('No portal URL received');
      return false;
    } catch (error) {
      console.error('Customer portal failed:', error);
      toast.error('Failed to open customer portal');
      return false;
    }
  }
};
