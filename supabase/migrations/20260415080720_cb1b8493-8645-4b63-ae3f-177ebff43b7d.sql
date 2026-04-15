
-- Enable pg_cron and pg_net
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Create function to call generate-embeddings for a single business
CREATE OR REPLACE FUNCTION public.notify_embedding_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _url TEXT;
  _anon_key TEXT;
BEGIN
  _url := current_setting('app.settings.supabase_url', true);
  
  -- If supabase_url setting not available, construct from project ref
  IF _url IS NULL OR _url = '' THEN
    _url := 'https://agoclnqfyinwjxdmjnns.supabase.co';
  END IF;

  -- Call the edge function to re-embed this business
  PERFORM extensions.http_post(
    url := _url || '/functions/v1/generate-embeddings',
    body := jsonb_build_object(
      'content_type', 'business',
      'batch_size', 1
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ'
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger on business insert/update
CREATE TRIGGER trg_business_embedding_update
  AFTER INSERT OR UPDATE OF business_name, name, description, category, city, state, address
  ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_embedding_update();

-- Schedule full re-index every 6 hours
SELECT cron.schedule(
  'reindex-all-embeddings',
  '0 */6 * * *',
  $$
  SELECT
    extensions.http_post(
      url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/generate-embeddings',
      body := '{"content_type": "all", "batch_size": 50}'::jsonb,
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ"}'::jsonb
    ) AS request_id;
  $$
);
