
import { supabase } from '@/lib/supabase';
import { subscriptionService } from './subscription-service';

export interface UnifiedSubscriptionInfo {
  isActive: boolean;
  tier: 'free' | 'paid' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  source: 'stripe' | 'apple' | 'google' | 'unknown';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  subscription_tier?: 'free' | 'premium' | 'business' | 'enterprise';
  subscription_end?: string;
  subscribed?: boolean;
  autoRenewEnabled?: boolean;
  isSandbox?: boolean;
}

export const unifiedSubscriptionService = {
  async checkAllSubscriptions(): Promise<UnifiedSubscriptionInfo> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check Stripe subscription first
      const stripeSubscription = await subscriptionService.checkSubscription();
      
      // Check Apple subscription from our database
      const { data: appleSubscription } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .eq('subscription_source', 'apple')
        .single();

      // Check Apple sandbox subscription
      const { data: appleSandboxSubscription } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .eq('subscription_source', 'apple_sandbox')
        .single();

      // Determine the active subscription
      let activeSubscription: UnifiedSubscriptionInfo;

      if (stripeSubscription.subscribed) {
        activeSubscription = {
          ...stripeSubscription,
          source: 'stripe'
        };
      } else if (appleSubscription?.subscribed) {
        activeSubscription = {
          isActive: true,
          tier: 'premium',
          status: 'active',
          source: 'apple',
          subscribed: true,
          subscription_tier: appleSubscription.subscription_tier || 'premium',
          subscription_end: appleSubscription.subscription_end,
          autoRenewEnabled: appleSubscription.auto_renew_enabled
        };
      } else if (appleSandboxSubscription?.subscribed) {
        activeSubscription = {
          isActive: true,
          tier: 'premium',
          status: 'active',
          source: 'apple',
          subscribed: true,
          subscription_tier: appleSandboxSubscription.subscription_tier || 'premium',
          subscription_end: appleSandboxSubscription.subscription_end,
          autoRenewEnabled: appleSandboxSubscription.auto_renew_enabled,
          isSandbox: true
        };
      } else {
        activeSubscription = {
          isActive: false,
          tier: 'free',
          status: 'canceled',
          source: 'unknown',
          subscribed: false,
          subscription_tier: 'free'
        };
      }

      return activeSubscription;
    } catch (error) {
      console.error('Error checking unified subscriptions:', error);
      return {
        isActive: false,
        tier: 'free',
        status: 'canceled',
        source: 'unknown',
        subscribed: false,
        subscription_tier: 'free'
      };
    }
  },

  async refreshSubscriptionStatus(): Promise<void> {
    try {
      // This will be called after webhook notifications
      const subscription = await this.checkAllSubscriptions();
      console.log('Subscription status refreshed:', subscription);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    }
  }
};
