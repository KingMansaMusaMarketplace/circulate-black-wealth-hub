
import { supabase } from '@/lib/supabase';
import { SalesAgent, SalesAgentApplication, TestQuestion, Referral, AgentCommission } from '@/types/sales-agent';

export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: 'active'
    } as SalesAgent;
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
    return {
      ...data,
      status: data.is_active ? 'active' : 'inactive'
    } as SalesAgent;
  } catch (error) {
    console.error('Error getting sales agent:', error);
    return null;
  }
};

export const getSalesAgentByUserId = async (userId: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.is_active ? 'active' : 'inactive'
    } as SalesAgent;
  } catch (error) {
    console.error('Error getting sales agent by user ID:', error);
    return null;
  }
};

export const getSalesAgentApplication = async (userId: string): Promise<SalesAgentApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_applications')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.application_status as SalesAgentApplication['status'],
      why_join: '',
      business_experience: '',
      marketing_ideas: ''
    } as SalesAgentApplication;
  } catch (error) {
    console.error('Error getting sales agent application:', error);
    return null;
  }
};

export const submitSalesAgentApplication = async (application: {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
}): Promise<SalesAgentApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_applications')
      .insert({
        user_id: application.user_id,
        full_name: application.full_name,
        email: application.email,
        phone: application.phone,
        application_status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.application_status as SalesAgentApplication['status'],
      why_join: '',
      business_experience: '',
      marketing_ideas: ''
    } as SalesAgentApplication;
  } catch (error) {
    console.error('Error submitting sales agent application:', error);
    return null;
  }
};

export const getTestQuestions = async (): Promise<TestQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_tests')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data as TestQuestion[];
  } catch (error) {
    console.error('Error getting test questions:', error);
    return [];
  }
};

export const submitTestAttempt = async (attempt: {
  user_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  application_id: string;
}): Promise<void> => {
  try {
    const { error: testError } = await supabase
      .from('sales_agent_test_attempts')
      .insert({
        user_id: attempt.user_id,
        score: attempt.score,
        passed: attempt.passed,
        answers: attempt.answers,
        completed_date: new Date().toISOString()
      });
    
    if (testError) throw testError;
    
    // Update the application with the test results
    await updateApplicationAfterTest(attempt.application_id, attempt.score, attempt.passed);
    
  } catch (error) {
    console.error('Error submitting test attempt:', error);
  }
};

export const updateApplicationAfterTest = async (
  applicationId: string, 
  testScore: number, 
  testPassed: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_agent_applications')
      .update({
        test_score: testScore,
        test_passed: testPassed
      })
      .eq('id', applicationId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating application after test:', error);
  }
};

export const getAgentReferrals = async (agentId: string): Promise<Referral[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('sales_agent_id', agentId);
    
    if (error) throw error;
    return data as Referral[];
  } catch (error) {
    console.error('Error getting agent referrals:', error);
    return [];
  }
};

export const getAgentCommissions = async (agentId: string): Promise<AgentCommission[]> => {
  try {
    const { data, error } = await supabase
      .from('agent_commissions')
      .select('*')
      .eq('sales_agent_id', agentId);
    
    if (error) throw error;
    return data as AgentCommission[];
  } catch (error) {
    console.error('Error getting agent commissions:', error);
    return [];
  }
};
