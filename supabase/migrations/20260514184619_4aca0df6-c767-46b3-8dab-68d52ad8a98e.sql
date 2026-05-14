
-- #4 noir_drivers: lock down PII columns at the column-grant level
REVOKE SELECT (drivers_license_number, license_plate) ON public.noir_drivers FROM anon, authenticated;

-- #5 investor_access_log: remove spoofable JWT claim branch
DROP POLICY IF EXISTS "Admins and service role can insert access logs" ON public.investor_access_log;
CREATE POLICY "Admins and service role can insert access logs"
ON public.investor_access_log
FOR INSERT
TO authenticated, service_role
WITH CHECK (
  is_admin_secure() OR auth.role() = 'service_role'
);

-- #6 b2b_external_leads: stop exposing PII rows to discoverers; keep admin-only access
DROP POLICY IF EXISTS "Users can view leads they discovered" ON public.b2b_external_leads;
