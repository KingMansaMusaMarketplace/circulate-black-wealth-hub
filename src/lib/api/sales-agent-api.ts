
import { supabase } from '@/lib/supabase';
import { SalesAgent, SalesAgentApplication, TestQuestion, SecureTestQuestion, TestValidationResult } from '@/types/sales-agent';
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

    // Use the new secure function to create application with personal data
    const { data: applicationId, error } = await supabase.rpc('create_sales_agent_application_secure', {
      p_user_id: user.id,
      p_full_name: applicationData.full_name,
      p_email: applicationData.email,
      p_phone: applicationData.phone,
      p_why_join: applicationData.why_join,
      p_business_experience: applicationData.business_experience,
      p_marketing_ideas: applicationData.marketing_ideas
    });

    if (error) throw error;

    // Fetch the created application (without personal data for security)
    const { data: appData, error: fetchError } = await supabase
      .from('sales_agent_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    // Map the database result to match the SalesAgentApplication type
    // Note: Personal data will not be included in the response for security
    const application: SalesAgentApplication = {
      id: appData.id,
      user_id: appData.user_id,
      full_name: applicationData.full_name, // Include from input for immediate UI feedback
      email: applicationData.email,       // Include from input for immediate UI feedback
      phone: applicationData.phone,       // Include from input for immediate UI feedback
      why_join: appData.why_join || '',
      business_experience: appData.business_experience || '',
      marketing_ideas: appData.marketing_ideas || '',
      application_status: appData.application_status,
      status: appData.application_status as 'pending' | 'approved' | 'rejected',
      test_score: appData.test_score,
      test_passed: appData.test_passed,
      application_date: appData.application_date,
      reviewed_by: appData.reviewed_by,
      reviewed_at: appData.reviewed_at,
      notes: appData.notes
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
  // Use the new secure function to create application with personal data
  const { error } = await supabase.rpc('create_sales_agent_application_secure', {
    p_user_id: applicationData.user_id,
    p_full_name: applicationData.full_name,
    p_email: applicationData.email,
    p_phone: applicationData.phone,
    p_why_join: null,
    p_business_experience: null,
    p_marketing_ideas: null
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

    // Note: Personal data (full_name, email, phone) is no longer in this table
    // For regular users, we return the application without personal data for security
    // Personal data is only accessible to admins through secure functions
    const application: SalesAgentApplication = {
      id: data.id,
      user_id: data.user_id,
      full_name: '', // Personal data not accessible to regular users
      email: '',     // Personal data not accessible to regular users  
      phone: '',     // Personal data not accessible to regular users
      why_join: data.why_join || '',
      business_experience: data.business_experience || '',
      marketing_ideas: data.marketing_ideas || '',
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
    // Use the secure function that only returns minimal data
    const { data: referralData, error: referralError } = await supabase
      .rpc('get_active_referral_codes');

    if (referralError) {
      console.error('Error fetching active referral codes:', referralError);
      return null;
    }

    const agent = referralData?.find((agent: any) => agent.referral_code === referralCode);
    if (!agent) {
      console.log('No active agent found for referral code:', referralCode);
      return null;
    }

    // Return minimal safe data for referral functionality only
    return {
      id: '', // Don't expose internal ID
      referral_code: agent.referral_code,
      is_active: agent.is_active,
      user_id: '', // Don't expose user_id in public context
      email: '', // Don't expose email
      full_name: '', // Don't expose full name
      phone: null, // Don't expose phone
      commission_rate: 0,
      total_pending: 0,
      total_earned: 0,
      created_at: '',
      updated_at: ''
    } as SalesAgent;
  } catch (error: any) {
    console.error('Error fetching sales agent by referral code:', error);
    return null;
  }
};

export const getTestQuestions = async (): Promise<SecureTestQuestion[]> => {
  try {
    const { data, error } = await supabase.rpc('get_test_questions_for_user');

    if (error) {
      console.error('Error fetching test questions:', error);
      return [];
    }

    return data as SecureTestQuestion[];
  } catch (error: any) {
    console.error('Error fetching test questions:', error);
    return [];
  }
};

export const validateTestAnswers = async (answers: {[key: string]: string}): Promise<TestValidationResult | null> => {
  try {
    const { data, error } = await supabase.rpc('validate_test_answers', {
      answer_data: answers
    });

    if (error) {
      console.error('Error validating test answers:', error);
      return null;
    }

    return data as TestValidationResult;
  } catch (error: any) {
    console.error('Error validating test answers:', error);
    return null;
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
