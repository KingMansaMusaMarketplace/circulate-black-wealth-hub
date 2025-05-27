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

export const getSalesAgentByReferralCode = async (referralCode: string): Promise<SalesAgent | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('referral_code', referralCode)
      .single();

    if (error) {
      console.error('Error fetching sales agent by referral code:', error);
      return null;
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
      .from('test_questions')
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
