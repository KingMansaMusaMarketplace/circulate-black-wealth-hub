
import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: string;
  customer_id: string;
  business_id: string;
  points_earned: number;
  points_redeemed: number;
  amount?: number;
  discount_applied?: number;
  discount_percentage?: number;
  description: string;
  transaction_type: 'purchase' | 'scan' | 'review' | 'referral' | 'redemption';
  qr_scan_id?: string;
  transaction_date: string;
  created_at: string;
  business?: {
    business_name: string;
    logo_url?: string;
  };
}

// Get customer transactions
export const getCustomerTransactions = async (
  customerId: string,
  limit?: number
): Promise<Transaction[]> => {
  try {
    let query = supabase
      .from('transactions')
      .select('*, businesses(business_name, logo_url)')
      .eq('customer_id', customerId)
      .order('transaction_date', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      transaction_type: item.transaction_type as Transaction['transaction_type']
    }));
  } catch (error: any) {
    console.error('Error fetching customer transactions:', error.message);
    return [];
  }
};

// Get business transactions
export const getBusinessTransactions = async (
  businessId: string,
  limit?: number
): Promise<Transaction[]> => {
  try {
    let query = supabase
      .from('transactions')
      .select('*, profiles(full_name)')
      .eq('business_id', businessId)
      .order('transaction_date', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      transaction_type: item.transaction_type as Transaction['transaction_type']
    }));
  } catch (error: any) {
    console.error('Error fetching business transactions:', error.message);
    return [];
  }
};

// Create a new transaction
export const createTransaction = async (
  transaction: Omit<Transaction, 'id' | 'created_at' | 'transaction_date'>
): Promise<{ success: boolean; transaction?: Transaction; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        transaction_date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update loyalty points if this transaction earns points
    if (transaction.points_earned > 0) {
      // First check if entry exists
      const { data: existingPoints } = await supabase
        .from('loyalty_points')
        .select('id, points')
        .eq('customer_id', transaction.customer_id)
        .eq('business_id', transaction.business_id)
        .single();
      
      if (existingPoints) {
        // Update existing points
        await supabase
          .from('loyalty_points')
          .update({ 
            points: existingPoints.points + transaction.points_earned,
            updated_at: new Date().toISOString() 
          })
          .eq('customer_id', transaction.customer_id)
          .eq('business_id', transaction.business_id);
      } else {
        // Create new loyalty points entry
        await supabase
          .from('loyalty_points')
          .insert({
            customer_id: transaction.customer_id,
            business_id: transaction.business_id,
            points: transaction.points_earned
          });
      }
    }
    
    return { 
      success: true, 
      transaction: {
        ...data,
        transaction_type: data.transaction_type as Transaction['transaction_type']
      }
    };
  } catch (error: any) {
    console.error('Error creating transaction:', error.message);
    return { success: false, error };
  }
};
