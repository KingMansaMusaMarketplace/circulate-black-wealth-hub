-- Fix overlapping RLS policies on profiles table
-- The issue is having multiple SELECT policies that could conflict

-- Drop the redundant/overlapping policy
DROP POLICY IF EXISTS "Admins view profiles" ON public.profiles;

-- The remaining policies are correct:
-- 1. "Users can view own profile" - (id = auth.uid()) for authenticated users
-- 2. "Admins can view all profiles" - is_admin_secure() for authenticated users
-- 3. "Anonymous users cannot access profiles" - false for anon

-- Verify the sales_agents policies are secure (they already are, but let's add a comment)
COMMENT ON TABLE public.sales_agents IS 'Sales agent profiles. RLS restricts access to own profile only, with admin override via is_admin_secure().';

-- Add comment documenting the security model for profiles
COMMENT ON TABLE public.profiles IS 'User profiles with PII. RLS enforces: users see only own profile, admins see all via is_admin_secure(), anonymous access denied.';