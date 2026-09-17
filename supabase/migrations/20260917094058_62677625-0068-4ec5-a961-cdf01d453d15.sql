-- Schedule the nightly lesson review, reusing the same authorization header as
-- the existing nightly Kayla job so no new secret is introduced.
DO $$
DECLARE
  tmpl TEXT;
BEGIN
  SELECT command INTO tmpl FROM cron.job WHERE jobname = 'kayla-data-agent-daily' LIMIT 1;
  IF tmpl IS NULL THEN
    RAISE NOTICE 'template job not found; skipping schedule';
    RETURN;
  END IF;

  PERFORM cron.unschedule('kayla-learning-review-nightly')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'kayla-learning-review-nightly');

  PERFORM cron.schedule(
    'kayla-learning-review-nightly',
    '30 7 * * *',
    replace(tmpl, 'kayla-data-agent', 'kayla-learning-review')
  );
END $$;