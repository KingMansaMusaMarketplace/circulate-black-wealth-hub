
import { supabase } from '@/integrations/supabase/client';
import { SalesAgentApplication, SalesAgent, Referral, AgentCommission, TestQuestion, TestAttempt } from '@/types/sales-agent';
import { Json } from '@/integrations/supabase/types';
import { handleApiError, showUserFriendlyError, logActivity } from '@/lib/utils/error-utils';

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
    showUserFriendlyError(error, 'fetch application');
    return null;
  }
};

// Submit a sales agent application
export const submitSalesAgentApplication = async (application: Omit<SalesAgentApplication, 'id' | 'application_date' | 'application_status' | 'test_passed'>): Promise<SalesAgentApplication | null> => {
  try {
    // Log the activity attempt
    await logActivity('attempt_submit', 'sales_agent_application', application.user_id);
    
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
    
    // Log successful submission
    await logActivity('submit_success', 'sales_agent_application', data.id, { 
      email: application.email 
    });
    
    // Type assertion to ensure compatibility with our defined types
    return data as unknown as SalesAgentApplication;
  } catch (error) {
    const loggedError = await handleApiError(error, 'submitSalesAgentApplication', { 
      email: application.email 
    });
    showUserFriendlyError(loggedError, 'submit application');
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
    // Log the update attempt
    await logActivity('attempt_update', 'sales_agent_application', applicationId, {
      score,
      passed
    });
    
    const { error } = await supabase
      .from('sales_agent_applications')
      .update({
        test_score: score,
        test_passed: passed
      })
      .eq('id', applicationId);
    
    if (error) throw error;
    
    // Log successful update
    await logActivity('update_success', 'sales_agent_application', applicationId, {
      score,
      passed
    });
    
    return true;
  } catch (error) {
    const loggedError = await handleApiError(error, 'updateApplicationAfterTest', { 
      applicationId, 
      score, 
      passed 
    });
    showUserFriendlyError(loggedError, 'update application');
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
    showUserFriendlyError(error, 'fetch agent profile');
    return null;
  }
};

// Get sales agent by referral code
export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    if (!referralCode || referralCode.trim() === '') {
      throw new Error('Invalid referral code');
    }
    
    const normalizedCode = referralCode.trim().toUpperCase();
    
    // Log the validation attempt
    await logActivity('validate_referral', 'sales_agent', 'system', { 
      referralCode: normalizedCode 
    });
    
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('referral_code', normalizedCode)
      .eq('is_active', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        console.warn(`Referral code not found: ${normalizedCode}`);
        return null;
      }
      throw error;
    }
    
    // Log successful validation
    await logActivity('validate_referral_success', 'sales_agent', data.id, { 
      referralCode: normalizedCode 
    });
    
    return data as SalesAgent;
  } catch (error) {
    const loggedError = await handleApiError(error, 'getSalesAgentByReferralCode', { 
      referralCode 
    });
    showUserFriendlyError(loggedError, 'validate referral code');
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
    const loggedError = await handleApiError(error, 'getAgentReferrals', { agentId });
    showUserFriendlyError(loggedError, 'fetch referrals');
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
    const loggedError = await handleApiError(error, 'getAgentCommissions', { agentId });
    showUserFriendlyError(loggedError, 'fetch commissions');
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
    const loggedError = await handleApiError(error, 'getTestQuestions');
    showUserFriendlyError(loggedError, 'fetch test questions');
    return [];
  }
};

// Submit test answers
export const submitTestAttempt = async (attempt: Omit<TestAttempt, 'id' | 'attempt_date'>): Promise<TestAttempt | null> => {
  try {
    // Log the test submission attempt
    await logActivity('attempt_test_submit', 'sales_agent_test', attempt.user_id, {
      score: attempt.score,
      passed: attempt.passed
    });
    
    const { data, error } = await supabase
      .from('sales_agent_test_attempts')
      .insert({
        ...attempt,
        completed_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (attempt.passed && attempt.application_id) {
      // Update the application to mark test as passed
      await updateApplicationAfterTest(
        attempt.application_id,
        attempt.score,
        attempt.passed
      );
      
      // Log successful test completion
      await logActivity('test_passed', 'sales_agent_application', attempt.application_id, {
        score: attempt.score
      });
    }
    
    // Type casting to handle JSON conversion for answers
    return {
      ...data,
      answers: data.answers as unknown as { [questionId: string]: string }
    } as TestAttempt;
  } catch (error) {
    const loggedError = await handleApiError(error, 'submitTestAttempt', {
      userId: attempt.user_id,
      score: attempt.score,
      passed: attempt.passed
    });
    showUserFriendlyError(loggedError, 'submit test attempt');
    return null;
  }
};

// Process referral manually (this would normally happen via database triggers)
export const processReferral = async () => {
  try {
    // Log the process attempt
    await logActivity('process_referrals', 'system', 'system');
    
    // Call the Edge Function to process pending referrals
    const { data, error } = await supabase.functions.invoke('process-referral');
    
    if (error) throw error;
    
    // Log successful processing
    await logActivity('process_referrals_success', 'system', 'system', {
      results: data
    });
    
    return data;
  } catch (error) {
    const loggedError = await handleApiError(error, 'processReferral');
    showUserFriendlyError(loggedError, 'process referrals');
    return null;
  }
};
