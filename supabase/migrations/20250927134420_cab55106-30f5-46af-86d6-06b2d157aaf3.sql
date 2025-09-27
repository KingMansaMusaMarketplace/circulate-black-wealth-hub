-- Double-check that sales_agents table has proper RLS and no public access
-- Let's explicitly verify and tighten any remaining access

-- Ensure RLS is enabled
ALTER TABLE public.sales_agents ENABLE ROW LEVEL SECURITY;

-- Remove any potential remaining public policies 
DROP POLICY IF EXISTS "Public can view minimal referral info secure" ON public.sales_agents;
DROP POLICY IF EXISTS "Public can view only referral codes" ON public.sales_agents;
DROP POLICY IF EXISTS "Authenticated users can view active sales agents" ON public.sales_agents;

-- Ensure we only have the secure policies we want
DROP POLICY IF EXISTS "Admins can manage all sales agents secure" ON public.sales_agents;
DROP POLICY IF EXISTS "Sales agents can view their own profile secure" ON public.sales_agents;

-- Recreate clean, secure policies
CREATE POLICY "Admins have full access to sales agents" 
ON public.sales_agents 
FOR ALL 
USING (is_admin_secure()) 
WITH CHECK (is_admin_secure());

CREATE POLICY "Sales agents can view only their own profile" 
ON public.sales_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Sales agents can update only their own profile" 
ON public.sales_agents 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Verify no other policies exist that could grant public access
-- Check that our secure RPC function is the only way to access referral codes publicly