import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  action: string;
  table_name: string;
  record_id?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export const logSecurityEvent = async (entry: AuditLogEntry) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('security_audit_log')
      .insert({
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id,
        user_id: user?.id || entry.user_id,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent || navigator.userAgent
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Specific logging functions for common security events
export const logPasswordUpdate = async (userId: string) => {
  await logSecurityEvent({
    action: 'password_update',
    table_name: 'auth.users',
    record_id: userId
  });
};

export const logSensitiveDataAccess = async (tableName: string, recordId?: string) => {
  await logSecurityEvent({
    action: 'sensitive_data_access',
    table_name: tableName,
    record_id: recordId
  });
};

export const logUnauthorizedAccess = async (tableName: string, attemptedAction: string) => {
  await logSecurityEvent({
    action: `unauthorized_${attemptedAction}`,
    table_name: tableName
  });
};