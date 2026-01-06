import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Secure admin role change function
export const changeUserRole = async (
  targetUserId: string, 
  newRole: 'admin' | 'customer' | 'business' | 'sales_agent',
  reason?: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Use the new secure role management function
    const { data, error } = await supabase.rpc('secure_change_user_role', {
      target_user_id: targetUserId,
      new_role: newRole,
      reason: reason || 'Admin role change'
    });

    if (error) {
      toast.error(`Failed to change user role: ${error.message}`);
      return { success: false, error };
    }

    // Check if the function returned an error in the response
    if (data && !data.success) {
      toast.error(data.error || 'Failed to change user role');
      return { success: false, error: data.error };
    }

    toast.success(`User role changed to ${newRole} successfully. Change logged for audit.`);
    return { success: true };
  } catch (error) {
    console.error('Error changing user role:', error);
    toast.error('An unexpected error occurred while changing user role');
    return { success: false, error };
  }
};

// Get role change audit logs (admin only)
export const getRoleChangeAudit = async () => {
  try {
    const { data, error } = await supabase
      .from('role_change_audit')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch role change audit:', error);
      return { data: [], error };
    }
    
    // Fetch profiles separately for both user_id and changed_by
    const userIds = [...new Set((data || []).map(r => r.user_id).filter(Boolean))];
    const changedByIds = [...new Set((data || []).map(r => r.changed_by).filter(Boolean))];
    const allIds = [...new Set([...userIds, ...changedByIds])];
    
    let profilesData: any[] = [];
    if (allIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', allIds);
      profilesData = profiles || [];
    }
    
    const profilesMap = new Map(profilesData.map(p => [p.id, p]));
    
    const enrichedData = (data || []).map(r => ({
      ...r,
      profiles: profilesMap.get(r.user_id) || null,
      changed_by_profile: profilesMap.get(r.changed_by) || null
    }));

    return { data: enrichedData, error: null };
  } catch (error) {
    console.error('Role change audit error:', error);
    return { data: [], error };
  }
};

// Get failed authentication attempts (admin only)
export const getFailedAuthAttempts = async () => {
  try {
    const { data, error } = await supabase
      .from('failed_auth_attempts')
      .select('*')
      .order('attempt_time', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch auth attempts:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Auth attempts error:', error);
    return { data: [], error };
  }
};

// Get security audit logs (admin only)
export const getSecurityAuditLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('security_audit_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch security audit logs:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Security audit logs error:', error);
    return { data: [], error };
  }
};