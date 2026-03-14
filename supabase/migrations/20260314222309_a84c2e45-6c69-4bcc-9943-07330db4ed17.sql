-- Update kayla-auto-discover cron job from every 3 minutes to every 2 minutes
SELECT cron.unschedule(14);

SELECT cron.schedule(
  'kayla-auto-discover-businesses-v2',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-auto-discover',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_service_role_key' LIMIT 1)
    ),
    body := '{}'::jsonb
  );
  $$
);