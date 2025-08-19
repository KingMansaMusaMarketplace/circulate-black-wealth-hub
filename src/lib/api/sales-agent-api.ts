
import { supabase } from '@/lib/supabase';
import { SalesAgent, SalesAgentApplication, TestQuestion } from '@/types/sales-agent';
import { toast } from 'sonner';

export const createSalesAgentApplication = async (applicationData: {
  full_name: string;
  email: string;
  phone?: string;
  why_join: string;
  business_experience: string;
  marketing_ideas: string;
}): Promise<{ success: boolean; application?: SalesAgentApplication; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('sales_agent_applications')
      .insert({
        user_id: user.id,
        full_name: applicationData.full_name,
        email: applicationData.email,
        phone: applicationData.phone,
        why_join: applicationData.why_join,
        business_experience: applicationData.business_experience,
        marketing_ideas: applicationData.marketing_ideas,
        application_status: 'pending',
        test_passed: false
      })
      .select()
      .single();

    if (error) throw error;

    // Map the database result to match the SalesAgentApplication type
    const application: SalesAgentApplication = {
      id: data.id,
      user_id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      why_join: applicationData.why_join,
      business_experience: applicationData.business_experience,
      marketing_ideas: applicationData.marketing_ideas,
      application_status: data.application_status,
      status: data.application_status as 'pending' | 'approved' | 'rejected',
      test_score: data.test_score,
      test_passed: data.test_passed,
      application_date: data.application_date,
      reviewed_by: data.reviewed_by,
      reviewed_at: data.reviewed_at,
      notes: data.notes
    };

    toast.success('Application submitted successfully!');
    return { success: true, application };
  } catch (error: any) {
    console.error('Error creating sales agent application:', error);
    toast.error('Failed to submit application: ' + error.message);
    return { success: false, error };
  }
};

export const submitSalesAgentApplication = async (applicationData: {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
}): Promise<void> => {
  const { data, error } = await supabase
    .from('sales_agent_applications')
    .insert({
      user_id: applicationData.user_id,
      full_name: applicationData.full_name,
      email: applicationData.email,
      phone: applicationData.phone,
      application_status: 'pending',
      test_passed: false
    });

  if (error) throw error;
};

export const getSalesAgentApplication = async (): Promise<SalesAgentApplication | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('sales_agent_applications')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    // Map the database result to match the SalesAgentApplication type
    const application: SalesAgentApplication = {
      id: data.id,
      user_id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      why_join: '', // These fields are not stored in the current table
      business_experience: '',
      marketing_ideas: '',
      application_status: data.application_status,
      status: data.application_status as 'pending' | 'approved' | 'rejected',
      test_score: data.test_score,
      test_passed: data.test_passed,
      application_date: data.application_date,
      reviewed_by: data.reviewed_by,
      reviewed_at: data.reviewed_at,
      notes: data.notes
    };

    return application;
  } catch (error: any) {
    console.error('Error fetching sales agent application:', error);
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

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as SalesAgent;
  } catch (error: any) {
    console.error('Error fetching sales agent by user ID:', error);
    return null;
  }
};

export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    // First get the agent ID from the public function (limited data)
    const { data: publicAgents, error: publicError } = await supabase
      .rpc('get_public_sales_agents');

    if (publicError) {
      console.error('Error fetching public sales agents:', publicError);
      return null;
    }

    const agent = publicAgents?.find(agent => agent.referral_code === referralCode);
    if (!agent) {
      return null;
    }

    // Now get the full agent data (this will only work if user is the agent themselves due to RLS)
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('id', agent.id)
      .single();

    if (error) {
      // If we can't get full data due to RLS, return minimal public data
      return {
        id: agent.id,
        referral_code: agent.referral_code,
        is_active: agent.is_active,
        created_at: agent.created_at,
        user_id: '', // Don't expose user_id in public context
        email: '', // Don't expose email
        full_name: '', // Don't expose full name
        phone: null, // Don't expose phone
        commission_rate: null,
        total_pending: null,
        total_earned: null,
        updated_at: null
      } as SalesAgent;
    }

    return data as SalesAgent;
  } catch (error: any) {
    console.error('Error fetching sales agent by referral code:', error);
    return null;
  }
};

export const getTestQuestions = async (): Promise<TestQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_agent_tests')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching test questions:', error);
      return [];
    }

    return data as TestQuestion[];
  } catch (error: any) {
    console.error('Error fetching test questions:', error);
    return [];
  }
};

export const submitTestResults = async (testScore: number): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('sales_agent_applications')
      .update({ test_score: testScore, test_passed: testScore >= 70 })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error submitting test results:', error);
      return { success: false, error };
    }

    toast.success('Test results submitted successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting test results:', error);
    toast.error('Failed to submit test results: ' + error.message);
    return { success: false, error };
  }
};

export const submitTestAttempt = async (attemptData: {
  user_id: string;
  score: number;
  passed: boolean;
  answers: {[key: string]: string};
  application_id: string;
}): Promise<void> => {
  const { error } = await supabase
    .from('sales_agent_test_attempts')
    .insert({
      user_id: attemptData.user_id,
      score: attemptData.score,
      passed: attemptData.passed,
      answers: attemptData.answers
    });

  if (error) throw error;

  // Update the application with test results
  await supabase
    .from('sales_agent_applications')
    .update({
      test_score: attemptData.score,
      test_passed: attemptData.passed
    })
    .eq('id', attemptData.application_id);
};

export const updateApplicationAfterTest = async (applicationId: string, testData: {
  test_score: number;
  test_passed: boolean;
}): Promise<void> => {
  const { error } = await supabase
    .from('sales_agent_applications')
    .update(testData)
    .eq('id', applicationId);

  if (error) throw error;
};

export const getAgentReferrals = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('sales_agent_id', agentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agent referrals:', error);
    return [];
  }
};

export const getAgentCommissions = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from('agent_commissions')
      .select('*')
      .eq('sales_agent_id', agentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agent commissions:', error);
    return [];
  }
};
