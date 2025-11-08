import { supabase } from '@/integrations/supabase/client';

/**
 * Get all payment batches
 */
export const getPaymentBatches = async () => {
  try {
    const { data, error } = await supabase
      .from('payment_batches')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment batches:', error);
    throw error;
  }
};

/**
 * Get payments for an agent
 */
export const getAgentPayments = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        batch:batch_id(
          batch_number,
          payment_date
        ),
        commission:commission_id(
          referral_id,
          due_date
        )
      `)
      .eq('sales_agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agent payments:', error);
    throw error;
  }
};
