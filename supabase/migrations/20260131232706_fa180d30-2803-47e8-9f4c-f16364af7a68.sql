-- =====================================================
-- SECURITY FIX: Tighten RLS policies for profiles and sales_agents
-- =====================================================

-- 1. PROFILES TABLE: Consolidate SELECT policies to prevent any gaps
-- Drop existing SELECT policies and create a single consolidated one
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create single, explicit SELECT policy combining both conditions
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles
FOR SELECT
TO authenticated
USING ((id = auth.uid()) OR is_admin_secure());

-- Ensure anonymous users are explicitly blocked (keep existing but ensure it exists)
DROP POLICY IF EXISTS "Anonymous users cannot access profiles" ON public.profiles;
CREATE POLICY "Anonymous users cannot access profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 2. SALES_AGENTS TABLE: Consolidate SELECT policies similarly
DROP POLICY IF EXISTS "Sales agents can view only their own profile" ON public.sales_agents;

-- Create explicit SELECT policy that covers both agent self-access and admin access
CREATE POLICY "Agents can view own data or admins can view all"
ON public.sales_agents
FOR SELECT
TO authenticated
USING ((user_id = auth.uid()) OR is_admin_secure());

-- Block anonymous completely on SELECT
DROP POLICY IF EXISTS "Deny public access to sales_agents" ON public.sales_agents;
CREATE POLICY "Anonymous users cannot access sales_agents"
ON public.sales_agents
FOR SELECT
TO anon
USING (false);

-- Also add explicit INSERT policy for sales_agents if missing
DROP POLICY IF EXISTS "Agents can insert own data" ON public.sales_agents;
CREATE POLICY "Agents can insert own data"
ON public.sales_agents
FOR INSERT
TO authenticated
WITH CHECK ((user_id = auth.uid()) OR is_admin_secure());

-- Add DELETE policy for admins only
DROP POLICY IF EXISTS "Only admins can delete sales agents" ON public.sales_agents;
CREATE POLICY "Only admins can delete sales agents"
ON public.sales_agents
FOR DELETE
TO authenticated
USING (is_admin_secure());