DO $$
BEGIN
  PERFORM cron.unschedule('refresh-sitemaps-weekly');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'refresh-sitemaps-weekly',
  '0 11 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/refresh-sitemaps-weekly',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  ) AS request_id;
  $$
);