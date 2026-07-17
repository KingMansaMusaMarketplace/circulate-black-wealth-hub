
CREATE OR REPLACE FUNCTION public.security_autopilot_snapshot()
RETURNS TABLE (
  id TEXT,
  category TEXT,
  severity TEXT,
  title TEXT,
  detail TEXT,
  table_or_function TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Only admins or service_role
  IF NOT (
    (auth.role() = 'service_role') OR
    public.has_role(auth.uid(), 'admin')
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  -- 1. Public tables without RLS enabled (HIGH)
  RETURN QUERY
  SELECT
    ('no_rls_' || c.relname)::TEXT,
    'Row-Level Security'::TEXT,
    'high'::TEXT,
    'Table has no Row-Level Security enabled'::TEXT,
    ('Table public.' || c.relname || ' is exposed via the API without RLS. Any authenticated user can read/write every row.')::TEXT,
    c.relname::TEXT
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND NOT c.relrowsecurity;

  -- 2. Public tables with RLS enabled but zero policies (HIGH)
  RETURN QUERY
  SELECT
    ('rls_no_policies_' || c.relname)::TEXT,
    'Row-Level Security'::TEXT,
    'high'::TEXT,
    'RLS enabled but no policies defined'::TEXT,
    ('Table public.' || c.relname || ' has RLS on but no policies, so all access is denied except for service_role. This may be intentional or may be a mistake.')::TEXT,
    c.relname::TEXT
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relrowsecurity
    AND NOT EXISTS (
      SELECT 1 FROM pg_policy p WHERE p.polrelid = c.oid
    );

  -- 3. SECURITY DEFINER functions callable by anon (CRITICAL)
  RETURN QUERY
  SELECT
    ('anon_secdef_' || p.proname || '_' || p.oid::text)::TEXT,
    'Function Permissions'::TEXT,
    'critical'::TEXT,
    'SECURITY DEFINER function callable by anonymous users'::TEXT,
    ('Function public.' || p.proname || ' runs with elevated privileges and can be called without signing in. Revoke EXECUTE from anon unless intentional.')::TEXT,
    p.proname::TEXT
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.prosecdef = true
    AND has_function_privilege('anon', p.oid, 'EXECUTE');

  -- 4. Functions without search_path set (MEDIUM)
  RETURN QUERY
  SELECT
    ('no_search_path_' || p.proname || '_' || p.oid::text)::TEXT,
    'Function Hygiene'::TEXT,
    'medium'::TEXT,
    'Function has no explicit search_path'::TEXT,
    ('Function public.' || p.proname || ' does not set search_path, which can be exploited via schema shadowing. Add SET search_path = public.')::TEXT,
    p.proname::TEXT
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.prosecdef = true
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(coalesce(p.proconfig, ARRAY[]::text[])) cfg
      WHERE cfg LIKE 'search_path=%'
    );

  -- 5. Extensions in public schema (LOW)
  RETURN QUERY
  SELECT
    ('ext_in_public_' || e.extname)::TEXT,
    'Extension Hygiene'::TEXT,
    'low'::TEXT,
    'Extension installed in public schema'::TEXT,
    ('Extension ' || e.extname || ' is in the public schema. Best practice is to move it to a dedicated schema.')::TEXT,
    e.extname::TEXT
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE n.nspname = 'public'
    AND e.extname NOT IN ('plpgsql');

  RETURN;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.security_autopilot_snapshot() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.security_autopilot_snapshot() TO authenticated, service_role;
