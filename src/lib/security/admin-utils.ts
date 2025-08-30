import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Secure admin role change function
export const changeUserRole = async (
  targetUserId: string, 
  newRole: 'admin' | 'customer' | 'business' | 'sales_agent',
  reason?: string
) => {
  try {
    const { data, error } = await supabase.rpc('admin_change_user_role', {
      target_user_id: targetUserId,
      new_role: newRole,
      reason: reason || 'Admin role change'
    });

    if (error) {
      toast.error(`Failed to change user role: ${error.message}`);
      return { success: false, error };
    }

    toast.success('User role updated successfully');
    return { success: true };
  } catch (error: any) {
    toast.error('An unexpected error occurred');
    console.error('Role change error:', error);
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