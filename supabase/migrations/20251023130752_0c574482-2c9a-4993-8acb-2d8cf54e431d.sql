-- ROLE CONSOLIDATION - Update RLS policies first
-- Update all policies that reference profiles.role to use has_role() instead

-- Step 1: Update business_access_log policy
DROP POLICY IF EXISTS "Admins can view business access logs" ON public.business_access_log;
CREATE POLICY "Admins can view business access logs" ON public.business_access_log
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 2: Update account_deletion_requests policy
DROP POLICY IF EXISTS "Admins can view all deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can view all deletion requests" ON public.account_deletion_requests
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 3: Update profiles policy
DROP POLICY IF EXISTS "Users can update their own basic profile data secure" ON public.profiles;
CREATE POLICY "Users can update their own basic profile data secure" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 4: Ensure all profiles have user_roles entries
INSERT INTO public.user_roles (user_id, role)
SELECT 
  p.id,
  CASE 
    WHEN p.role::text = 'admin' THEN 'admin'::app_role
    WHEN p.role::text = 'business' THEN 'business'::app_role
    WHEN p.role::text = 'sales_agent' THEN 'sales_agent'::app_role
    ELSE 'customer'::app_role
  END
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = p.id
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Drop triggers and function
DROP TRIGGER IF EXISTS prevent_role_escalation ON public.profiles;
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_role_escalation() CASCADE;

-- Step 6: NOW drop the role column
ALTER TABLE public.profiles DROP COLUMN role;

-- Step 7: Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Step 8: Create helper function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = user_id_param
  ORDER BY 
    CASE role
      WHEN 'admin'::app_role THEN 1
      WHEN 'sales_agent'::app_role THEN 2
      WHEN 'business'::app_role THEN 3
      ELSE 4
    END
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;