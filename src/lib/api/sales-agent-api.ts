
import { supabase } from '@/integrations/supabase/client';
import { 
  SalesAgentApplication, 
  SalesAgent, 
  Referral,
  AgentCommission,
  TestQuestion,
  TestAttempt
} from '@/types/sales-agent';

// Application functions
export const submitSalesAgentApplication = async (application: Partial<SalesAgentApplication>) => {
  const { data, error } = await supabase
    .from('sales_agent_applications')
    .insert([
      {
        user_id: application.user_id,
        full_name: application.full_name,
        email: application.email,
        phone: application.phone
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0] as SalesAgentApplication;
};

export const getSalesAgentApplication = async (userId: string) => {
  const { data, error } = await supabase
    .from('sales_agent_applications')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as SalesAgentApplication | null;
};

// Test functions
export const getTestQuestions = async () => {
  const { data, error } = await supabase
    .from('sales_agent_tests')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data as TestQuestion[];
};

export const submitTestAttempt = async (testAttempt: Partial<TestAttempt>) => {
  const { data, error } = await supabase
    .from('sales_agent_test_attempts')
    .insert([
      {
        user_id: testAttempt.user_id,
        score: testAttempt.score,
        passed: testAttempt.passed,
        answers: testAttempt.answers
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0] as TestAttempt;
};

export const updateApplicationAfterTest = async (
  applicationId: string, 
  score: number, 
  passed: boolean
) => {
  const { data, error } = await supabase
    .from('sales_agent_applications')
    .update({
      test_score: score,
      test_passed: passed
    })
    .eq('id', applicationId)
    .select();

  if (error) throw error;
  return data?.[0] as SalesAgentApplication;
};

// Agent functions
export const getSalesAgentByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('sales_agents')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as SalesAgent | null;
};

export const getSalesAgentByReferralCode = async (referralCode: string) => {
  const { data, error } = await supabase
    .from('sales_agents')
    .select('*')
    .eq('referral_code', referralCode)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as SalesAgent | null;
};

export const getAgentReferrals = async (agentId: string) => {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred_user:referred_user_id (
        email,
        created_at
      )
    `)
    .eq('sales_agent_id', agentId)
    .order('referral_date', { ascending: false });

  if (error) throw error;
  return data as any[];
};

export const getAgentCommissions = async (agentId: string) => {
  const { data, error } = await supabase
    .from('agent_commissions')
    .select(`
      *,
      referral:referral_id (
        referred_user_id,
        referred_user_type,
        referral_date
      )
    `)
    .eq('sales_agent_id', agentId)
    .order('due_date', { ascending: false });

  if (error) throw error;
  return data as any[];
};
