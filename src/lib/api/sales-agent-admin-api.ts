import { supabase } from '@/lib/supabase';
import { SalesAgentApplication } from '@/types/sales-agent';
import { toast } from 'sonner';

export interface ApplicationSummary {
  id: string;
  application_date: string;
  application_status: string;
  test_score?: number;
  test_passed: boolean;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface SecureApplicationDetails extends SalesAgentApplication {
  // Personal data is included for admin use only
}

/**
 * Fetch applications for admin review (without personal data for list view)
 * This provides a secure way to list applications without exposing sensitive data
 */
export const getApplicationsForReviewSecure = async (): Promise<ApplicationSummary[]> => {
  try {
    const { data, error } = await supabase.rpc('get_applications_for_review_secure');

    if (error) {
      console.error('Error fetching applications for review:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      application_date: item.application_date,
      application_status: item.application_status,
      test_score: item.test_score,
      test_passed: item.test_passed,
      reviewed_at: item.reviewed_at,
      reviewed_by: item.reviewed_by,
      notes: item.notes
    }));
  } catch (error: any) {
    console.error('Error fetching applications for review:', error);
    toast.error('Failed to fetch applications: ' + error.message);
    return [];
  }
};

/**
 * Fetch detailed application data including personal information for admin review
 * This function requires admin privileges and logs all access attempts
 */
export const getApplicationDetailsSecure = async (applicationId: string): Promise<SecureApplicationDetails | null> => {
  try {
    const { data, error } = await supabase.rpc('get_application_details_secure', {
      p_application_id: applicationId
    });

    if (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const item = data[0];
    
    // Map the secure application data
    const application: SecureApplicationDetails = {
      id: item.id,
      user_id: item.user_id,
      full_name: item.full_name,
      email: item.email,
      phone: item.phone,
      why_join: item.why_join || '',
      business_experience: item.business_experience || '',
      marketing_ideas: item.marketing_ideas || '',
      application_status: item.application_status,
      status: item.application_status as 'pending' | 'approved' | 'rejected',
      test_score: item.test_score,
      test_passed: item.test_passed,
      application_date: item.application_date,
      reviewed_by: item.reviewed_by,
      reviewed_at: item.reviewed_at,
      notes: item.notes
    };

    return application;
  } catch (error: any) {
    console.error('Error fetching application details:', error);
    toast.error('Failed to fetch application details: ' + error.message);
    return null;
  }
};

/**
 * Update application status (approve/reject)
 * Only affects non-sensitive application data
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('sales_agent_applications')
      .update({
        application_status: status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    // Log the admin action
    await supabase.rpc('log_activity', {
      activity_type: 'application_status_change',
      entity_type: 'sales_agent_applications',
      entity_id: applicationId,
      activity_details: { 
        new_status: status, 
        notes: notes,
        reviewed_by: user.id 
      }
    });

    toast.success(`Application ${status} successfully!`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating application status:', error);
    toast.error('Failed to update application: ' + error.message);
    return { success: false, error };
  }
};

/**
 * Create a sales agent profile from approved application
 * This securely transfers data from application to agent profile
 */
export const createSalesAgentFromApplication = async (
  applicationId: string,
  commissionRate: number = 10.0
): Promise<{ success: boolean; agentId?: string; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the application details securely
    const applicationDetails = await getApplicationDetailsSecure(applicationId);
    if (!applicationDetails) {
      throw new Error('Application not found');
    }

    if (applicationDetails.application_status !== 'approved') {
      throw new Error('Application must be approved before creating agent profile');
    }

    // Generate referral code
    const { data: referralCode, error: referralError } = await supabase.rpc('generate_referral_code');
    if (referralError) throw referralError;

    // Create the sales agent profile
    const { data: agentData, error: agentError } = await supabase
      .from('sales_agents')
      .insert({
        user_id: applicationDetails.user_id,
        full_name: applicationDetails.full_name,
        email: applicationDetails.email,
        phone: applicationDetails.phone,
        referral_code: referralCode,
        commission_rate: commissionRate,
        total_earned: 0,
        total_pending: 0,
        is_active: true
      })
      .select()
      .single();

    if (agentError) throw agentError;

    // Log the creation
    await supabase.rpc('log_activity', {
      activity_type: 'sales_agent_created',
      entity_type: 'sales_agents',
      entity_id: agentData.id,
      activity_details: { 
        application_id: applicationId,
        commission_rate: commissionRate,
        created_by: user.id 
      }
    });

    toast.success('Sales agent profile created successfully!');
    return { success: true, agentId: agentData.id };
  } catch (error: any) {
    console.error('Error creating sales agent from application:', error);
    toast.error('Failed to create sales agent: ' + error.message);
    return { success: false, error };
  }
};

/**
 * Get audit log for personal data access
 * This helps monitor who accessed sensitive application data
 */
export const getPersonalDataAccessAudit = async (applicationId?: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('security_audit_log')
      .select('*')
      .eq('action', 'personal_data_access')
      .eq('table_name', 'sales_agent_applications_personal_data')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error('Error fetching personal data access audit:', error);
    return [];
  }
};