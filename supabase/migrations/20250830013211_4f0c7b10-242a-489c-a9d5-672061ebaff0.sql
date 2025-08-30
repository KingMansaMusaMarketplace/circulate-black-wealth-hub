-- Priority 1: Fix Role Escalation Vulnerability
-- Add RLS policy to prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update their own profile only" ON public.profiles;

-- Create new policy that prevents role changes
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent role changes unless user is admin
  (OLD.role = NEW.role OR public.is_admin())
);

-- Create secure function for admin-only role changes
CREATE OR REPLACE FUNCTION public.admin_change_user_role(
  target_user_id uuid,
  new_role user_role,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  old_role user_role;
BEGIN
  -- Only allow admins to change roles
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Only admins can change user roles.';
  END IF;
  
  -- Get current role
  SELECT role INTO old_role 
  FROM public.profiles 
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found with ID: %', target_user_id;
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the role change
  INSERT INTO public.role_change_audit (
    user_id, 
    old_role, 
    new_role, 
    changed_by,
    reason
  ) VALUES (
    target_user_id, 
    old_role, 
    new_role, 
    auth.uid(),
    reason
  );
END;
$$;

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

-- Only admins can view failed auth attempts
CREATE POLICY "Admins can view failed auth attempts" 
ON public.failed_auth_attempts 
FOR SELECT 
USING (public.is_admin());

-- Add password complexity validation function
CREATE OR REPLACE FUNCTION public.validate_password_complexity(password text)
RETURNS boolean
LANGUAGE plpgsql
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

-- Add constraint to enforce password complexity for new user registrations
-- (This will be handled in the application layer since we can't intercept Supabase auth directly)