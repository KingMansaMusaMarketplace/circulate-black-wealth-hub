DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'marketing-credits-daily-refill') THEN
    PERFORM cron.unschedule('marketing-credits-daily-refill');
  END IF;
END $$;

SELECT cron.schedule(
  'marketing-credits-daily-refill',
  '15 0 * * *',
  $$
  select net.http_post(
    url:='https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/monthly-marketing-refill',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);