
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

      console.log('[Unified Subscription] Checking all subscription sources for user:', user.id);

      // Check Stripe subscription (web purchases)
      const stripeSubscription = await subscriptionService.checkSubscription();
      
      // Check Apple subscriptions (iOS purchases)
      const { data: appleSubscription } = await supabase
        .from('apple_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_date', new Date().toISOString())
        .order('expires_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Priority: Stripe > Apple
      if (stripeSubscription.subscribed) {
        console.log('[Unified Subscription] Active Stripe subscription found');
        return {
          ...stripeSubscription,
          source: 'stripe'
        };
      }

      if (appleSubscription && new Date(appleSubscription.expires_date) > new Date()) {
        console.log('[Unified Subscription] Active Apple subscription found');
        return {
          isActive: true,
          tier: 'premium',
          status: 'active',
          source: 'apple',
          subscribed: true,
          subscription_tier: this.mapAppleProductToTier(appleSubscription.product_id),
          subscription_end: appleSubscription.expires_date,
          autoRenewEnabled: appleSubscription.auto_renew_status
        };
      }

      console.log('[Unified Subscription] No active subscription found');
      return {
        isActive: false,
        tier: 'free',
        status: 'canceled',
        source: 'unknown',
        subscribed: false,
        subscription_tier: 'free'
      };
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

  mapAppleProductToTier(productId: string): 'free' | 'premium' | 'business' | 'enterprise' {
    const productMap: Record<string, 'free' | 'premium' | 'business' | 'enterprise'> = {
      'com.mansamusa.premium.monthly': 'premium',
      'com.mansamusa.business.basic.monthly': 'business',
      'com.mansamusa.business.premium.monthly': 'business',
      'com.mansamusa.business.enterprise.monthly': 'enterprise',
      'com.mansamusa.sponsor.community.monthly': 'premium',
      'com.mansamusa.sponsor.corporate.monthly': 'enterprise',
    };
    return productMap[productId] || 'premium';
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
