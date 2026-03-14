-- Update Kayla auto-discover to run every 3 minutes instead of 5
SELECT cron.unschedule('kayla-auto-discover-businesses-v2');

SELECT cron.schedule(
  'kayla-auto-discover-businesses-v2',
  '*/3 * * * *',
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