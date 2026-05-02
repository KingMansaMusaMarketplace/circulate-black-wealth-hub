DO $$
BEGIN
  -- Drop old broken v1 cron (stale project ref)
  PERFORM cron.unschedule(10);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'jobid 10 already removed';
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule(15);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'jobid 15 already removed';
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule(6);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'jobid 6 already removed';
END $$;

-- Recreate auto-discover at every 10 min
SELECT cron.schedule(
  'kayla-auto-discover-businesses-v2',
  '*/10 * * * *',
  $job$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-auto-discover',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ'
    ),
    body := '{"source":"cron"}'::jsonb
  );
  $job$
);

-- Recreate health check hourly
SELECT cron.schedule(
  'kayla-health-check-hourly',
  '0 * * * *',
  $job$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-health-check',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
    body := '{"checkType": "scheduled"}'::jsonb
  );
  $job$
);