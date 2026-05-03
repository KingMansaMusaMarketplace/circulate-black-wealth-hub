-- 1. Remove businesses from Realtime publication to stop broadcasting email/phone changes
ALTER PUBLICATION supabase_realtime DROP TABLE public.businesses;

-- 2. Tighten sales_agents "Admins full access" policy: public -> authenticated only
DROP POLICY IF EXISTS "Admins have full access to sales agents" ON public.sales_agents;
CREATE POLICY "Admins have full access to sales agents"
  ON public.sales_agents
  FOR ALL
  TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

DROP POLICY IF EXISTS "Sales agents can update only their own profile" ON public.sales_agents;
CREATE POLICY "Sales agents can update only their own profile"
  ON public.sales_agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Add missing DELETE policy on noir_drivers (admins only)
CREATE POLICY "Only admins can delete drivers"
  ON public.noir_drivers
  FOR DELETE
  TO authenticated
  USING (is_admin_secure());

-- 4. Tighten kayla_segment_members: scope to segments owned by the user's businesses
DROP POLICY IF EXISTS "Business owners manage segment members" ON public.kayla_segment_members;
CREATE POLICY "Business owners manage own segment members"
  ON public.kayla_segment_members
  FOR ALL
  TO authenticated
  USING (
    segment_id IN (
      SELECT s.id FROM public.kayla_customer_segments s
      JOIN public.businesses b ON b.id = s.business_id
      WHERE b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    segment_id IN (
      SELECT s.id FROM public.kayla_customer_segments s
      JOIN public.businesses b ON b.id = s.business_id
      WHERE b.owner_id = auth.uid()
    )
  );

-- 5. Tighten b2b_external_leads SELECT/UPDATE policies from public -> authenticated
DROP POLICY IF EXISTS "Users can view leads they discovered" ON public.b2b_external_leads;
CREATE POLICY "Users can view leads they discovered"
  ON public.b2b_external_leads
  FOR SELECT
  TO authenticated
  USING (
    (discovered_by_user_id = auth.uid()) OR
    (EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = b2b_external_leads.discovered_by_business_id
        AND b.owner_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Admins can view all leads" ON public.b2b_external_leads;
CREATE POLICY "Admins can view all leads"
  ON public.b2b_external_leads
  FOR SELECT
  TO authenticated
  USING (is_admin_secure());

DROP POLICY IF EXISTS "Users can view their discovered leads" ON public.b2b_external_leads;

DROP POLICY IF EXISTS "Users can update their leads" ON public.b2b_external_leads;
CREATE POLICY "Users can update their leads"
  ON public.b2b_external_leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = discovered_by_user_id)
  WITH CHECK (auth.uid() = discovered_by_user_id);