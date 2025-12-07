-- Fix overly permissive profiles table RLS policy
-- Drop the policy that allows any authenticated user to read all profiles
DROP POLICY IF EXISTS "Users can view all profiles basic info" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Ensure admins can still view all profiles (via existing policy or create if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.is_admin_secure());
  END IF;
END $$;