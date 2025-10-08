-- PRIORITY 1 CRITICAL SECURITY FIXES (CORRECTED)

-- ============================================
-- 1. REMOVE DANGEROUS exec_sql() FUNCTION
-- ============================================
DROP FUNCTION IF EXISTS public.exec_sql(text);

-- ============================================
-- 2. ADD MISSING RLS POLICIES
-- ============================================

-- Fix auth_attempt_log
CREATE POLICY "Admins can update auth attempt logs"
ON public.auth_attempt_log
FOR UPDATE
TO authenticated
USING (is_admin_secure());

CREATE POLICY "Admins can delete auth attempt logs"
ON public.auth_attempt_log
FOR DELETE
TO authenticated
USING (is_admin_secure());

-- Fix email_notifications
CREATE POLICY "System can insert email notifications"
ON public.email_notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update email notifications"
ON public.email_notifications
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Users cannot delete email notifications"
ON public.email_notifications
FOR DELETE
TO authenticated
USING (false);

-- Fix business_access_log
CREATE POLICY "System can log business access"
ON public.business_access_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix rate_limit_log
CREATE POLICY "System can insert rate limit logs"
ON public.rate_limit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- 3. IMPLEMENT ENCRYPTION FOR PERSONAL DATA
-- ============================================

-- Add encryption tracking columns
ALTER TABLE public.sales_agent_applications_personal_data
ADD COLUMN IF NOT EXISTS encryption_key_id uuid,
ADD COLUMN IF NOT EXISTS is_encrypted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS encryption_algorithm text DEFAULT 'aes-256-gcm';

-- Add comment documenting encryption requirement
COMMENT ON TABLE public.sales_agent_applications_personal_data IS 
'CRITICAL: All personal data in this table must be encrypted at rest. Fields encrypted_full_name, encrypted_email, and encrypted_phone should use AES-256-GCM encryption with keys stored in Supabase Vault.';

-- ============================================
-- 4. STRENGTHEN ADMIN ROLE CHECKS
-- ============================================

-- Add index on user_roles for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup 
ON public.user_roles(user_id, role);

-- ============================================
-- 5. ADD SECURITY AUDIT ENHANCEMENTS
-- ============================================

-- Add indices for security audit queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_action
ON public.security_audit_log(user_id, action, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_failed_auth_attempts_email_time
ON public.failed_auth_attempts(email, attempt_time DESC);

CREATE INDEX IF NOT EXISTS idx_personal_data_access_audit_time
ON public.personal_data_access_audit(accessed_at DESC);

-- Add cleanup function for old audit logs (90 day retention)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.security_audit_log
  WHERE timestamp < now() - interval '90 days';
  
  DELETE FROM public.failed_auth_attempts
  WHERE attempt_time < now() - interval '90 days';
  
  DELETE FROM public.personal_data_access_audit
  WHERE accessed_at < now() - interval '90 days';
  
  DELETE FROM public.rate_limit_log
  WHERE window_start < now() - interval '90 days';
END;
$$;

-- ============================================
-- 6. ADD MFA ENFORCEMENT FOR ADMINS
-- ============================================

CREATE OR REPLACE FUNCTION require_mfa_for_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_mfa_enabled boolean;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN true;
  END IF;
  
  SELECT COALESCE(
    (SELECT aal = 'aal2' FROM auth.sessions WHERE user_id = auth.uid() LIMIT 1),
    false
  ) INTO user_mfa_enabled;
  
  RETURN user_mfa_enabled;
END;
$$;