DO $$
DECLARE
  fn record;
  cnt int := 0;
BEGIN
  FOR fn IN
    SELECT n.nspname AS schema_name,
           p.proname AS function_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    BEGIN
      EXECUTE format(
        'REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC',
        fn.schema_name, fn.function_name, fn.args
      );
      cnt := cnt + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipped %.%(%): %', fn.schema_name, fn.function_name, fn.args, SQLERRM;
    END;
  END LOOP;
  RAISE NOTICE 'Revoked PUBLIC EXECUTE on % SECURITY DEFINER functions', cnt;
END $$;