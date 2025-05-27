
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  customer_id: string;
  business_id: string;
  transaction_type: 'purchase' | 'scan' | 'redemption' | 'review' | 'referral';
  amount?: number;
  points_earned: number;
  points_redeemed: number;
  discount_percentage: number;
  discount_applied: number;
  description?: string;
  qr_scan_id?: string;
  transaction_date: string;
  created_at: string;
  business?: {
    business_name: string;
    logo_url?: string;
  };
  customer?: {
    full_name: string;
    email: string;
  };
}

export const getCustomerTransactions = async (customerId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        businesses (
          business_name,
          logo_url
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Type assertion with proper type checking
    return (data || []).map(item => ({
      ...item,
      transaction_type: item.transaction_type as 'purchase' | 'scan' | 'redemption' | 'review' | 'referral',
      business: item.businesses ? {
        business_name: item.businesses.business_name,
        logo_url: item.businesses.logo_url
      } : undefined
    })) as Transaction[];
  } catch (error: any) {
    console.error('Error fetching customer transactions:', error);
    return [];
  }
};

export const getBusinessTransactions = async (businessId: string): Promise<Transaction[]> => {
  try {
    // First get transactions without profiles join since it's causing errors
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Then get customer profiles separately if needed
    const enrichedTransactions = await Promise.all(
      (transactions || []).map(async (transaction) => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', transaction.customer_id)
            .single();

          return {
            ...transaction,
            transaction_type: transaction.transaction_type as 'purchase' | 'scan' | 'redemption' | 'review' | 'referral',
            customer: profile ? {
              full_name: profile.full_name || 'Unknown',
              email: profile.email || 'Unknown'
            } : undefined
          };
        } catch {
          return {
            ...transaction,
            transaction_type: transaction.transaction_type as 'purchase' | 'scan' | 'redemption' | 'review' | 'referral',
            customer: undefined
          };
        }
      })
    );

    return enrichedTransactions as Transaction[];
  } catch (error: any) {
    console.error('Error fetching business transactions:', error);
    return [];
  }
};

export const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at'>): Promise<{ success: boolean; transaction?: Transaction; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        customer_id: transactionData.customer_id,
        business_id: transactionData.business_id,
        transaction_type: transactionData.transaction_type,
        amount: transactionData.amount,
        points_earned: transactionData.points_earned,
        points_redeemed: transactionData.points_redeemed,
        discount_percentage: transactionData.discount_percentage,
        discount_applied: transactionData.discount_applied,
        description: transactionData.description,
        qr_scan_id: transactionData.qr_scan_id,
        transaction_date: transactionData.transaction_date
      })
      .select()
      .single();

    if (error) throw error;

    const transaction: Transaction = {
      ...data,
      transaction_type: data.transaction_type as 'purchase' | 'scan' | 'redemption' | 'review' | 'referral'
    };

    toast.success('Transaction recorded successfully!');
    return { success: true, transaction };
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    toast.error('Failed to record transaction: ' + error.message);
    return { success: false, error };
  }
};
