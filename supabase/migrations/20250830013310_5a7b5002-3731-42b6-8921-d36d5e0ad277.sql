-- Priority 1: Fix Role Escalation Vulnerability
-- Drop existing policy
DROP POLICY IF EXISTS "Users can update their own profile only" ON public.profiles;

-- Create secure function for admin-only role changes first
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

-- Create new restrictive RLS policy that prevents role changes
CREATE POLICY "Users can update profile but not role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add trigger to prevent direct role updates (except by admin function)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow role changes only if done by admin through proper function
  -- or if the role hasn't actually changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Check if this is being called from the admin function
    -- by checking the current_setting for a special flag
    IF current_setting('app.admin_role_change', true) IS NULL THEN
      RAISE EXCEPTION 'Role changes must be performed by administrators through proper channels';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Update admin role change function to set the flag
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
  
  -- Set flag to allow role change
  PERFORM set_config('app.admin_role_change', 'true', true);
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Reset flag
  PERFORM set_config('app.admin_role_change', NULL, true);
  
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