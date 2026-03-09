-- SECURITY FIX: Redefine is_admin() to use user_roles table instead of profiles.user_type
-- This prevents privilege escalation where users could set their own user_type to 'admin'

-- 1. Redefine is_admin() to delegate to the secure user_roles-based check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- 2. Create a trigger to prevent users from modifying their own user_type or role columns
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins (verified via user_roles table) to change any column
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- For non-admin users, prevent changes to security-sensitive columns
  IF OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    RAISE EXCEPTION 'You are not allowed to change your user_type';
  END IF;
  
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'You are not allowed to change your role';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON public.profiles;

-- Create the trigger
CREATE TRIGGER prevent_privilege_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privilege_escalation();