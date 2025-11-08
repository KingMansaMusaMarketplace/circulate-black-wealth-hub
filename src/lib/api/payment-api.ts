import { supabase } from '@/integrations/supabase/client';

/**
 * Get payment history for an agent
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

/**
 * Get all payment batches (admin only)
 */
export const getPaymentBatches = async () => {
  try {
    const { data, error } = await supabase
      .from('payment_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment batches:', error);
    throw error;
  }
};

/**
 * Create a new payment batch
 */
export const createPaymentBatch = async (paymentDate: string, notes?: string) => {
  try {
    // Generate batch number
    const { data: batchNumber, error: batchError } = await supabase
      .rpc('generate_batch_number');

    if (batchError) throw batchError;

    // Create batch
    const { data, error } = await supabase
      .from('payment_batches')
      .insert({
        batch_number: batchNumber,
        payment_date: paymentDate,
        notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment batch:', error);
    throw error;
  }
};

/**
 * Process commission payment
 */
export const processCommissionPayment = async (
  commissionId: string,
  batchId?: string
) => {
  try {
    const { data, error } = await supabase
      .rpc('process_commission_payment', {
        p_commission_id: commissionId,
        p_batch_id: batchId || null
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing commission payment:', error);
    throw error;
  }
};

/**
 * Update payment batch status
 */
export const updatePaymentBatchStatus = async (
  batchId: string,
  status: string
) => {
  try {
    const { data, error } = await supabase
      .from('payment_batches')
      .update({
        status,
        processed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', batchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating batch status:', error);
    throw error;
  }
};

/**
 * Get payments for a specific batch
 */
export const getBatchPayments = async (batchId: string) => {
  try {
    const { data, error } = await supabase
      .from('commission_payments')
      .select(`
        *,
        sales_agent:sales_agent_id(
          full_name,
          email
        ),
        commission:commission_id(
          amount,
          commission_type
        )
      `)
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching batch payments:', error);
    throw error;
  }
};
