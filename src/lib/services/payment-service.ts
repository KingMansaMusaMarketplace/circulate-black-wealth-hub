import { supabase } from '@/lib/supabase';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  platformFee: number;
  businessAmount: number;
}

export interface ConnectAccountResult {
  url: string;
  accountId: string;
}

export interface PaymentAccount {
  id: string;
  business_id: string;
  stripe_account_id: string;
  account_status: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements_due: string[];
  created_at: string;
  updated_at: string;
}

export interface PlatformTransaction {
  id: string;
  business_id: string;
  customer_id: string;
  stripe_payment_intent_id: string;
  stripe_charge_id: string | null;
  amount_total: number;
  amount_business: number;
  amount_platform_fee: number;
  platform_fee_percentage: number;
  currency: string;
  status: string;
  description: string;
  customer_email: string;
  customer_name: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const paymentService = {
  async connectStripeAccount(businessId: string): Promise<ConnectAccountResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('connect-stripe-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          businessId,
          refreshUrl: `${window.location.origin}/business/dashboard`,
          returnUrl: `${window.location.origin}/business/dashboard?setup=complete`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error connecting Stripe account:', error);
      throw error;
    }
  },

  async createPaymentIntent(params: {
    businessId: string;
    amount: number;
    description?: string;
    customerEmail?: string;
    customerName?: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentIntentResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: params,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  async getPaymentAccount(businessId: string): Promise<PaymentAccount | null> {
    try {
      const { data, error } = await supabase
        .from('business_payment_accounts')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No account found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching payment account:', error);
      throw error;
    }
  },

  async getBusinessTransactions(businessId: string): Promise<PlatformTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('platform_transactions')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching business transactions:', error);
      throw error;
    }
  },

  async getCustomerTransactions(customerId: string): Promise<PlatformTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('platform_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching customer transactions:', error);
      throw error;
    }
  },

  async getPlatformRevenue(): Promise<{
    totalRevenue: number;
    transactionCount: number;
    avgTransactionValue: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('platform_transactions')
        .select('amount_platform_fee, amount_total')
        .eq('status', 'succeeded');

      if (error) throw error;

      const totalRevenue = data.reduce((sum, tx) => sum + parseFloat(tx.amount_platform_fee.toString()), 0);
      const transactionCount = data.length;
      const avgTransactionValue = transactionCount > 0 ? 
        data.reduce((sum, tx) => sum + parseFloat(tx.amount_total.toString()), 0) / transactionCount : 0;

      return {
        totalRevenue,
        transactionCount,
        avgTransactionValue,
      };
    } catch (error) {
      console.error('Error calculating platform revenue:', error);
      throw error;
    }
  },
};
