
import { supabase } from '@/integrations/supabase/client';
import { SalesAgentApplication, SalesAgent, Referral, AgentCommission, TestQuestion, TestAttempt } from '@/types/sales-agent';
import { Json } from '@/integrations/supabase/types';

// Get a sales agent application by user ID
export const getSalesAgentApplication = async (userId: string): Promise<SalesAgentApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_applications')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    // Type assertion to ensure compatibility with our defined types
    return data as unknown as SalesAgentApplication;
  } catch (error) {
    console.error('Error fetching sales agent application:', error);
    return null;
  }
};

// Submit a sales agent application
export const submitSalesAgentApplication = async (application: Omit<SalesAgentApplication, 'id' | 'application_date' | 'application_status' | 'test_passed'>): Promise<SalesAgentApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_applications')
      .insert({
        ...application,
        application_status: 'pending',
        test_passed: false
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Type assertion to ensure compatibility with our defined types
    return data as unknown as SalesAgentApplication;
  } catch (error) {
    console.error('Error creating sales agent application:', error);
    return null;
  }
};

// Update application after test
export const updateApplicationAfterTest = async (
  applicationId: string,
  score: number,
  passed: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sales_agent_applications')
      .update({
        test_score: score,
        test_passed: passed
      })
      .eq('id', applicationId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating application after test:', error);
    return false;
  }
};

// Get sales agent by user ID
export const getSalesAgentByUserId = async (userId: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data as SalesAgent;
  } catch (error) {
    console.error('Error fetching sales agent:', error);
    return null;
  }
};

// Get sales agent by referral code
export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('referral_code', referralCode)
      .single();
      
    if (error) throw error;
    
    return data as SalesAgent;
  } catch (error) {
    console.error('Error fetching sales agent by referral code:', error);
    return null;
  }
};

// Get agent referrals
export const getAgentReferrals = async (agentId: string): Promise<Referral[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred_user:referred_user_id (
          email
        )
      `)
      .eq('sales_agent_id', agentId)
      .order('referral_date', { ascending: false });
      
    if (error) throw error;
    
    // Type casting to ensure correct type compatibility
    return (data || []).map(item => ({
      ...item,
      referred_user_type: item.referred_user_type as 'customer' | 'business',
      commission_status: item.commission_status as 'pending' | 'paid' | 'cancelled'
    })) as Referral[];
  } catch (error) {
    console.error('Error fetching agent referrals:', error);
    return [];
  }
};

// Get agent commissions
export const getAgentCommissions = async (agentId: string): Promise<AgentCommission[]> => {
  try {
    const { data, error } = await supabase
      .from('agent_commissions')
      .select('*')
      .eq('sales_agent_id', agentId)
      .order('due_date', { ascending: false });
      
    if (error) throw error;
    
    // Type casting to ensure correct type compatibility
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'processing' | 'paid' | 'cancelled'
    })) as AgentCommission[];
  } catch (error) {
    console.error('Error fetching agent commissions:', error);
    return [];
  }
};

// Get test questions
export const getTestQuestions = async (): Promise<TestQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_tests')
      .select('*')
      .eq('is_active', true);
      
    if (error) throw error;
    
    // Type casting to ensure correct type compatibility
    return (data || []).map(item => ({
      ...item,
      correct_answer: item.correct_answer as 'A' | 'B' | 'C' | 'D'
    })) as TestQuestion[];
  } catch (error) {
    console.error('Error fetching test questions:', error);
    return [];
  }
};

// Submit test answers
export const submitTestAttempt = async (attempt: Omit<TestAttempt, 'id' | 'attempt_date'>): Promise<TestAttempt | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_test_attempts')
      .insert({
        ...attempt,
        completed_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (attempt.passed) {
      // Update the application to mark test as passed
      await updateApplicationAfterTest(
        attempt.application_id!, // Added this parameter
        attempt.score,
        attempt.passed
      );
    }
    
    // Type casting to handle JSON conversion for answers
    return {
      ...data,
      answers: data.answers as unknown as { [questionId: string]: string }
    } as TestAttempt;
  } catch (error) {
    console.error('Error submitting test attempt:', error);
    return null;
  }
};

// Process referral manually (this would normally happen via database triggers)
export const processReferral = async () => {
  try {
    // Call the Edge Function to process pending referrals
    const { data, error } = await supabase.functions.invoke('process-referral');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error processing referrals:', error);
    return null;
  }
};
