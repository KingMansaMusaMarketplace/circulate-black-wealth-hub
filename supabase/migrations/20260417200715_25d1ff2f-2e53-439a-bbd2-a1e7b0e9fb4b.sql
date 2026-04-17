CREATE OR REPLACE FUNCTION public.notify_embedding_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'net'
AS $function$
DECLARE
  _url TEXT;
BEGIN
  _url := current_setting('app.settings.supabase_url', true);
  IF _url IS NULL OR _url = '' THEN
    _url := 'https://agoclnqfyinwjxdmjnns.supabase.co';
  END IF;

  BEGIN
    PERFORM net.http_post(
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
  EXCEPTION WHEN OTHERS THEN
    -- Don't block business updates if embedding notification fails
    RAISE WARNING 'notify_embedding_update failed: %', SQLERRM;
  END;

  RETURN COALESCE(NEW, OLD);
END;
$function$;