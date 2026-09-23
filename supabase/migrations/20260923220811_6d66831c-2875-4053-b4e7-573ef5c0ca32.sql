INSERT INTO public.internal_job_tokens(name, token)
SELECT 'claim-campaign-daily', encode(gen_random_bytes(32),'hex')
WHERE NOT EXISTS (SELECT 1 FROM public.internal_job_tokens WHERE name='claim-campaign-daily');

DO $$ BEGIN PERFORM cron.unschedule('claim-campaign-daily'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
SELECT cron.schedule(
  'claim-campaign-daily',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/claim-campaign-daily',
    headers := jsonb_build_object('Content-Type','application/json',
      'x-job-token', (SELECT token FROM public.internal_job_tokens WHERE name='claim-campaign-daily')),
    body := jsonb_build_object('trigger','cron')
  );
  $$
);