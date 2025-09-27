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
      .select(`
        *,
        profiles!role_change_audit_user_id_fkey(full_name, email),
        changed_by_profile:profiles!role_change_audit_changed_by_fkey(full_name, email)
      `)
      .order('changed_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch role change audit:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
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