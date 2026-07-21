-- Restore column-level SELECT to authenticated so admin approvals, owner
-- onboarding, First Hour dashboard, Kayla welcome wizard, featured spotlight,
-- and directory timeout-fallback queries stop failing with permission denied.
-- anon stays revoked so anonymous scrapers still cannot read owner PII.
GRANT SELECT (email, phone, address, latitude, longitude)
  ON public.businesses TO authenticated;