-- Phase 1: Critical Security Fixes

-- 1. Create proper admin role system
CREATE TYPE public.user_role AS ENUM ('customer', 'business', 'admin', 'sales_agent');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'customer';

-- Update existing profiles based on user_type
UPDATE public.profiles 
SET role = CASE 
  WHEN user_type = 'business' THEN 'business'::public.user_role
  WHEN user_type = 'customer' THEN 'customer'::public.user_role
  ELSE 'customer'::public.user_role
END;

-- Make role non-nullable after setting defaults
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- 2. Create security definer function for proper admin checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = auth.uid() AND 
      role = 'admin'
  );
$$;

-- 3. Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_role public.user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = auth.uid() AND 
      role = _role
  );
$$;

-- 4. Secure sales agent tests - restrict access to authenticated users only
DROP POLICY IF EXISTS "Tests are viewable by everyone" ON public.sales_agent_tests;

CREATE POLICY "Tests are viewable by authenticated users only" 
ON public.sales_agent_tests 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 5. Add RLS policies to business_directory (fix the exposed data issue)
ALTER TABLE public.business_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business directory is publicly viewable" 
ON public.business_directory 
FOR SELECT 
USING (true);

-- 6. Create audit log for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  old_role public.user_role,
  new_role public.user_role NOT NULL,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now(),
  reason text
);

ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role change audit" 
ON public.role_change_audit 
FOR SELECT 
USING (public.is_admin());

-- 7. Create trigger for role change auditing
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.role_change_audit (
      user_id, 
      old_role, 
      new_role, 
      changed_by
    ) VALUES (
      NEW.id, 
      OLD.role, 
      NEW.role, 
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();

-- 8. Update existing admin-related policies to use new is_admin function
-- Note: Most policies already use is_admin() so they will automatically use the new implementation