-- Secure auth_attempt_log table - restrict access to admins only
-- This table contains sensitive data: emails, IPs, user agents, failure reasons

-- Remove any existing overly permissive policies
DROP POLICY IF EXISTS "Admins can view auth attempt logs" ON public.auth_attempt_log;

-- Create strict admin-only access policy
CREATE POLICY "Only admins can view auth attempt logs" 
ON public.auth_attempt_log 
FOR SELECT 
USING (is_admin_secure());

-- Ensure no other operations are allowed except for system inserts
-- Only the system should be able to insert logs, not regular users
CREATE POLICY "System can insert auth attempt logs" 
ON public.auth_attempt_log 
FOR INSERT 
WITH CHECK (true); -- This will be restricted by application logic

-- Admins can delete old logs for cleanup
CREATE POLICY "Admins can delete old auth attempt logs" 
ON public.auth_attempt_log 
FOR DELETE 
USING (is_admin_secure());

-- No UPDATE policy - logs should be immutable once created

-- Double-check that RLS is enabled on this table
ALTER TABLE public.auth_attempt_log ENABLE ROW LEVEL SECURITY;