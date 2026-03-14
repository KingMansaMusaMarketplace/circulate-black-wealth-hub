SELECT cron.unschedule('kayla-auto-discover-businesses-v2');

SELECT cron.schedule(
  'kayla-auto-discover-businesses-v2',
  '*/5 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-auto-discover',
      headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);