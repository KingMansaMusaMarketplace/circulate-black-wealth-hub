DO $$
DECLARE
  _cron_secret text;
BEGIN
  BEGIN
    PERFORM cron.unschedule('lease-saved-search-notify-daily');
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    SELECT decrypted_secret INTO _cron_secret
    FROM vault.decrypted_secrets
    WHERE name = 'CRON_SECRET'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    _cron_secret := NULL;
  END;

  PERFORM cron.schedule(
    'lease-saved-search-notify-daily',
    '0 14 * * *',
    format(
      $job$
      SELECT net.http_post(
        url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/lease-saved-search-notify',
        headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',%L),
        body := '{}'::jsonb
      );
      $job$, coalesce(_cron_secret,'')
    )
  );
END $$;