
-- Defense-in-depth: explicit deny-anon SELECT policies on sensitive tables.
-- RLS is already enabled with no anon-permissive policies, so anon access is
-- already blocked. These policies make that explicit and prevent future
-- misconfiguration from silently exposing PII.

CREATE POLICY "Deny anonymous access to b2b_external_leads"
  ON public.b2b_external_leads FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anonymous access to b2b_external_leads_private"
  ON public.b2b_external_leads_private FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anonymous access to vacation_properties"
  ON public.vacation_properties FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anonymous access to noir_drivers"
  ON public.noir_drivers FOR SELECT TO anon USING (false);
