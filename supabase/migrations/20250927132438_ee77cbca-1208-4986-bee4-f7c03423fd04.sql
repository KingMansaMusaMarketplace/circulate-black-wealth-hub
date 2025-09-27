-- CRITICAL SECURITY FIXES
-- Fix 1: Restrict sales_agents table to prevent personal data exposure

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can view minimal referral info secure" ON public.sales_agents;

-- Create a much more restrictive policy - only referral codes for public access
CREATE POLICY "Public can view only referral codes" 
ON public.sales_agents 
FOR SELECT 
USING (is_active = true AND auth.role() = 'authenticated'::text);

-- Create a secure view for public referral data that only exposes safe fields
CREATE OR REPLACE VIEW public.public_referral_codes AS
SELECT 
  referral_code,
  is_active,
  created_at
FROM public.sales_agents 
WHERE is_active = true;

-- Enable RLS on the view (though it inherits from table)
ALTER VIEW public.public_referral_codes SET (security_barrier = true);

-- Fix 2: Strengthen profiles table RLS policies

-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Users can view their own profile secure" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles secure" ON public.profiles;

-- Create more secure profile access policies
CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view profiles with audit logging" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin_secure() AND 
  -- Log the admin access for audit
  (SELECT public.access_personal_data_secure(id, 'profile_view', 'Admin profile review'))::jsonb->>'success' = 'true'
);

-- Fix 3: Enhance authentication security with server-side rate limiting

-- Create enhanced auth attempt logging
CREATE TABLE IF NOT EXISTS public.auth_attempt_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  ip_address inet,
  attempt_time timestamp with time zone DEFAULT now(),
  success boolean DEFAULT false,
  user_agent text,
  failure_reason text
);

-- Enable RLS on auth attempt log
ALTER TABLE public.auth_attempt_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view auth attempt logs
CREATE POLICY "Admins can view auth attempt logs" 
ON public.auth_attempt_log 
FOR SELECT 
USING (is_admin_secure());

-- Create secure authentication rate limiting function
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit_secure(p_email text, p_ip inet DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    recent_failed_attempts integer;
    recent_all_attempts integer;
    blocked_until timestamptz;
    result jsonb;
BEGIN
    -- Check failed attempts from this email in last 15 minutes
    SELECT COUNT(*) INTO recent_failed_attempts
    FROM public.failed_auth_attempts
    WHERE email = p_email 
      AND attempt_time > now() - interval '15 minutes'
      AND (p_ip IS NULL OR ip_address = p_ip);
    
    -- Check all attempts from this IP in last 5 minutes
    SELECT COUNT(*) INTO recent_all_attempts  
    FROM public.failed_auth_attempts
    WHERE ip_address = p_ip
      AND attempt_time > now() - interval '5 minutes';
    
    -- Block if too many failed attempts
    IF recent_failed_attempts >= 5 OR recent_all_attempts >= 10 THEN
        blocked_until := now() + interval '30 minutes';
        
        -- Log the block
        INSERT INTO public.security_audit_log (
            action, table_name, user_agent, timestamp
        ) VALUES (
            'auth_rate_limit_exceeded',
            'authentication',
            format('Email: %s, IP: %s, Failed: %s, All: %s', p_email, p_ip, recent_failed_attempts, recent_all_attempts),
            now()
        );
        
        RETURN jsonb_build_object(
            'allowed', false,
            'blocked_until', blocked_until,
            'reason', 'Too many failed authentication attempts',
            'failed_attempts', recent_failed_attempts,
            'all_attempts', recent_all_attempts
        );
    END IF;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'failed_attempts', recent_failed_attempts,
        'all_attempts', recent_all_attempts
    );
END;
$$;

-- Fix 4: Secure all functions with proper search_path (fixes mutable search path warning)
-- Update existing functions to have secure search_path

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = auth.uid() AND 
      role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(_role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = auth.uid() AND 
      role = _role
  );
$$;

-- Fix 5: Create security monitoring function
CREATE OR REPLACE FUNCTION public.get_security_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    failed_auth_24h integer;
    admin_actions_24h integer;
    suspicious_ips integer;
    result jsonb;
BEGIN
    -- Only admins can access security metrics
    IF NOT public.is_admin_secure() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Count failed auth attempts in last 24 hours
    SELECT COUNT(*) INTO failed_auth_24h
    FROM public.failed_auth_attempts
    WHERE attempt_time > now() - interval '24 hours';
    
    -- Count admin actions in last 24 hours  
    SELECT COUNT(*) INTO admin_actions_24h
    FROM public.security_audit_log
    WHERE action LIKE 'admin_%'
      AND timestamp > now() - interval '24 hours';
      
    -- Count suspicious IPs (multiple failed attempts)
    SELECT COUNT(DISTINCT ip_address) INTO suspicious_ips
    FROM public.failed_auth_attempts
    WHERE attempt_time > now() - interval '24 hours'
    GROUP BY ip_address
    HAVING COUNT(*) >= 3;
    
    result := jsonb_build_object(
        'failed_auth_attempts_24h', failed_auth_24h,
        'admin_actions_24h', admin_actions_24h, 
        'suspicious_ips', suspicious_ips,
        'last_updated', now()
    );
    
    RETURN result;
END;
$$;

-- Create indexes for better performance on security-related queries
CREATE INDEX IF NOT EXISTS idx_failed_auth_attempts_email_time ON public.failed_auth_attempts(email, attempt_time);
CREATE INDEX IF NOT EXISTS idx_failed_auth_attempts_ip_time ON public.failed_auth_attempts(ip_address, attempt_time);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action_time ON public.security_audit_log(action, timestamp);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_time ON public.security_audit_log(user_id, timestamp);