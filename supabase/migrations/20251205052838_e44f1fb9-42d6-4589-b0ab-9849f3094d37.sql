-- Fix is_admin function to use correct column name (user_type instead of role)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = auth.uid() AND 
      user_type = 'admin'
  );
$$;