CREATE OR REPLACE FUNCTION public.sync_cron_secret(p_secret text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, vault AS $$
DECLARE _id uuid;
BEGIN
  IF p_secret IS NULL OR length(p_secret) < 24 THEN RAISE EXCEPTION 'invalid secret'; END IF;
  SELECT id INTO _id FROM vault.secrets WHERE name = 'CRON_SECRET' LIMIT 1;
  IF _id IS NULL THEN PERFORM vault.create_secret(p_secret, 'CRON_SECRET', 'Scheduled job secret');
  ELSE PERFORM vault.update_secret(_id, p_secret); END IF;
END $$;
REVOKE ALL ON FUNCTION public.sync_cron_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_cron_secret(text) TO service_role;

DO $$
DECLARE r record; c text;
  v constant text := 'jsonb_build_object(''x-cron-secret'',(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name=''CRON_SECRET'' LIMIT 1))';
BEGIN
  FOR r IN SELECT jobid, command FROM cron.job WHERE command ILIKE '%x-cron-secret%' AND command NOT ILIKE '%vault.decrypted_secrets%' AND username = current_user LOOP
    c := r.command;
    c := regexp_replace(c, ',\s*"x-cron-secret"\s*:\s*"[^"]*"\s*}''::jsonb', '}''::jsonb || ' || v, 'g');
    c := regexp_replace(c, ',\s*"x-cron-secret"\s*:\s*"''\s*\|\|\s*current_setting\([^)]*\)\s*\|\|\s*''"\s*}''::jsonb', '}''::jsonb || ' || v, 'g');
    c := regexp_replace(c, '''x-cron-secret''\s*,\s*''[^'']+''', '''x-cron-secret'', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name=''CRON_SECRET'' LIMIT 1)', 'g');
    IF c <> r.command THEN PERFORM cron.alter_job(r.jobid, command := c); END IF;
  END LOOP;
END $$;