-- Restore column access for admin tooling (RLS still limits rows to admins)
GRANT SELECT (owner_name, owner_email, phone_number, contact_info)
  ON public.b2b_external_leads TO authenticated;

-- Hard, non-overridable guard: no matter what permissive policies exist now or
-- are added later, only admins (or service_role) can read lead rows.
DROP POLICY IF EXISTS "Restrict lead reads to admins" ON public.b2b_external_leads;
CREATE POLICY "Restrict lead reads to admins"
  ON public.b2b_external_leads
  AS RESTRICTIVE
  FOR SELECT
  TO authenticated, anon
  USING (public.is_admin_secure());