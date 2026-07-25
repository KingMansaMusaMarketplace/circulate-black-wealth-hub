
-- Universal admin-only column guard for privileged fields across public schema.
-- Applies to any table that has any of these sensitive columns and doesn't
-- already have a *_privileged_fields or guard_admin_only trigger.

CREATE OR REPLACE FUNCTION public.enforce_sensitive_columns_admin_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
  v_old jsonb;
  v_new jsonb;
  v_col text;
  v_sensitive text[] := ARRAY[
    'is_verified','verified','verification_status',
    'approved_at','approved_by','rejected_at','rejected_by','rejection_reason',
    'commission_rate','commission_amount','commission_cents',
    'priority_score','is_featured','featured_until',
    'tier','subscription_tier','activated_at'
  ];
BEGIN
  -- Service role & superuser bypass
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  BEGIN
    v_is_admin := public.is_admin_secure();
  EXCEPTION WHEN OTHERS THEN
    v_is_admin := false;
  END;

  IF v_is_admin THEN
    RETURN NEW;
  END IF;

  v_old := to_jsonb(OLD);
  v_new := to_jsonb(NEW);

  FOREACH v_col IN ARRAY v_sensitive LOOP
    IF v_old ? v_col AND (v_old -> v_col) IS DISTINCT FROM (v_new -> v_col) THEN
      RAISE EXCEPTION 'Permission denied: column % is admin-only', v_col
        USING ERRCODE = '42501';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_sensitive_columns_admin_only() FROM PUBLIC, anon, authenticated;

-- Attach trigger to every base table in public that has ≥1 sensitive column
-- and does not already have a privileged/guard trigger.
DO $do$
DECLARE
  r record;
  has_guard boolean;
BEGIN
  FOR r IN
    SELECT DISTINCT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.column_name IN (
        'is_verified','verified','verification_status',
        'approved_at','approved_by','rejected_at','rejected_by','rejection_reason',
        'commission_rate','commission_amount','commission_cents',
        'priority_score','is_featured','featured_until',
        'tier','subscription_tier','activated_at'
      )
  LOOP
    SELECT EXISTS (
      SELECT 1
      FROM pg_trigger tg
      JOIN pg_class cl ON tg.tgrelid = cl.oid
      JOIN pg_namespace n ON cl.relnamespace = n.oid
      JOIN pg_proc p ON tg.tgfoid = p.oid
      WHERE n.nspname = 'public'
        AND cl.relname = r.table_name
        AND NOT tg.tgisinternal
        AND (
          p.proname ILIKE '%privileged%'
          OR p.proname ILIKE '%admin_only%'
          OR p.proname = 'enforce_sensitive_columns_admin_only'
          OR p.proname = 'protect_businesses_privileged_fields'
        )
    ) INTO has_guard;

    IF NOT has_guard THEN
      EXECUTE format(
        'CREATE TRIGGER trg_enforce_sensitive_cols_admin_only
           BEFORE UPDATE ON public.%I
           FOR EACH ROW EXECUTE FUNCTION public.enforce_sensitive_columns_admin_only()',
        r.table_name
      );
      RAISE NOTICE 'Attached admin-only guard to %', r.table_name;
    END IF;
  END LOOP;
END
$do$;
