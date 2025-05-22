
import { supabase } from '@/lib/supabase';
import { SalesAgent } from '@/types/sales-agent';

export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as SalesAgent;
  } catch (error) {
    console.error('Error getting sales agent:', error);
    return null;
  }
};

export const getSalesAgentById = async (agentId: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (error) throw error;
    return data as SalesAgent;
  } catch (error) {
    console.error('Error getting sales agent:', error);
    return null;
  }
};
