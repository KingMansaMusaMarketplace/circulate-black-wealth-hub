-- Defense-in-depth: revoke EXECUTE from anon on admin-only SECURITY DEFINER functions.
-- All of these already perform internal has_role(auth.uid(), 'admin') checks,
-- but removing anon EXECUTE prevents probing and reduces attack surface.

DO $$
DECLARE
  f RECORD;
BEGIN
  FOR f IN
    SELECT n.nspname AS schema_name,
           p.proname AS func_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND (
        p.proname LIKE 'admin\_%' ESCAPE '\'
        OR p.proname LIKE 'approve\_%' ESCAPE '\'
        OR p.proname LIKE 'reject\_%' ESCAPE '\'
        OR p.proname LIKE 'assign\_admin%' ESCAPE '\'
        OR p.proname LIKE '%\_admin' ESCAPE '\'
        OR p.proname IN (
          'access_personal_data_secure',
          'can_access_admin_features'
        )
      )
      AND has_function_privilege('anon', p.oid, 'EXECUTE')
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM anon',
      f.func_name, f.args
    );
  END LOOP;
END $$;