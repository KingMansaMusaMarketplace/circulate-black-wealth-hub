-- Remove any public-readable SELECT policy from sales_agents to prevent exposure of PII
DROP POLICY IF EXISTS "Public can view minimal referral info secure" ON public.sales_agents;
DROP POLICY IF EXISTS "Public can view only referral codes" ON public.sales_agents;

-- Keep admin full access and self-access policies intact
-- Ensure there is NO catch-all SELECT policy; public access should use RPC only

-- Double-check: re-create explicit policies for clarity (idempotent)
DO $$
BEGIN
  -- Admins manage all
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'sales_agents' AND policyname = 'Admins can manage all sales agents secure' 
  ) THEN
    CREATE POLICY "Admins can manage all sales agents secure" ON public.sales_agents
    USING (is_admin_secure()) WITH CHECK (is_admin_secure());
  END IF;
  
  -- Agents can view their own
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'sales_agents' AND policyname = 'Sales agents can view their own profile secure' 
  ) THEN
    CREATE POLICY "Sales agents can view their own profile secure" ON public.sales_agents
    FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;