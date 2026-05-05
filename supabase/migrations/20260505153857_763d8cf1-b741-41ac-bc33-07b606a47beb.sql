
UPDATE public.b2b_external_leads
SET normalized_name = public.normalize_business_name(business_name)
WHERE normalized_name IS NULL;

UPDATE public.b2b_external_leads
SET website_domain = lower(regexp_replace(regexp_replace(website_url, '^https?://(www\.)?', ''), '/.*$', ''))
WHERE website_domain IS NULL AND website_url IS NOT NULL;

UPDATE public.businesses
SET normalized_name = public.normalize_business_name(coalesce(business_name, name))
WHERE normalized_name IS NULL;

UPDATE public.businesses
SET website_domain = lower(regexp_replace(regexp_replace(website, '^https?://(www\.)?', ''), '/.*$', ''))
WHERE website_domain IS NULL AND website IS NOT NULL AND website <> '';

DO $$ BEGIN PERFORM cron.unschedule('kayla-auto-discover-businesses-v2'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN PERFORM cron.unschedule('kayla-auto-discover-businesses'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN PERFORM cron.unschedule('kayla-verify-and-promote'); EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'kayla-auto-discover-businesses',
  '*/15 * * * *',
  $cron$
  SELECT net.http_post(
    url:='https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-auto-discover',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
    body:='{"source":"cron"}'::jsonb
  );
  $cron$
);

SELECT cron.schedule(
  'kayla-verify-and-promote',
  '7-59/15 * * * *',
  $cron$
  SELECT net.http_post(
    url:='https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-verify-and-promote',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb,
    body:='{"source":"cron"}'::jsonb
  );
  $cron$
);
