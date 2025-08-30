-- Add additional security tables and functions (avoiding duplicates)
-- Add failed authentication logging table
CREATE TABLE IF NOT EXISTS public.failed_auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  ip_address inet,
  user_agent text,
  attempt_time timestamp with time zone DEFAULT now(),
  failure_reason text
);

-- Enable RLS on failed auth attempts
ALTER TABLE public.failed_auth_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Admins can view failed auth attempts" ON public.failed_auth_attempts;
CREATE POLICY "Admins can view failed auth attempts" 
ON public.failed_auth_attempts 
FOR SELECT 
USING (public.is_admin());

-- Add password complexity validation function
CREATE OR REPLACE FUNCTION public.validate_password_complexity(password text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- At least 8 characters
  IF length(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one number
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Must contain at least one special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Add business access rate limiting function
CREATE OR REPLACE FUNCTION public.check_business_access_rate_limit(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_accesses integer;
BEGIN
  -- Count business accesses in the last minute
  SELECT COUNT(*) INTO recent_accesses
  FROM public.business_access_log
  WHERE user_id = user_id_param
    AND accessed_at > now() - interval '1 minute';
  
  -- Allow max 30 business accesses per minute
  RETURN recent_accesses < 30;
END;
$$;

-- Add function to log failed authentication attempts
CREATE OR REPLACE FUNCTION public.log_failed_auth_attempt(
  email_param text,
  reason_param text,
  ip_param inet DEFAULT NULL,
  user_agent_param text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.failed_auth_attempts (
    email,
    failure_reason,
    ip_address,
    user_agent
  ) VALUES (
    email_param,
    reason_param,
    ip_param,
    user_agent_param
  );
END;
$$;