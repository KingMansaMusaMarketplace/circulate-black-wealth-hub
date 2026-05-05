SELECT net.http_post(
  url:='https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-verify-and-promote',
  headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ","x-cron-secret":"7d97a6b426ef74cb32e0ffa6e79ca0077d52c7310571598a2c5afd90294fdb8c"}'::jsonb,
  body:='{"source":"manual_drain"}'::jsonb
);

-- Try to (re)schedule the cron with the cron secret. cron.schedule replaces by name.
SELECT cron.schedule(
  'kayla-verify-and-promote',
  '7-59/15 * * * *',
  $cmd$
  SELECT net.http_post(
    url:='https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-verify-and-promote',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ","x-cron-secret":"7d97a6b426ef74cb32e0ffa6e79ca0077d52c7310571598a2c5afd90294fdb8c"}'::jsonb,
    body:='{"source":"cron"}'::jsonb
  );
  $cmd$
);