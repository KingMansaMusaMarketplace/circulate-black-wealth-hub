CREATE OR REPLACE FUNCTION public.kayla_emit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _event_type text := TG_ARGV[0];
  _target_service text := TG_ARGV[1];
  _record_id uuid := NEW.id;
  _exists boolean;
  _cron_secret text;
BEGIN
  -- Deduplicate: skip if same event_type + record_id within 5 seconds
  SELECT EXISTS(
    SELECT 1 FROM public.kayla_event_queue
    WHERE event_type = _event_type
      AND record_id = _record_id
      AND created_at > (now() - interval '5 seconds')
  ) INTO _exists;

  IF _exists THEN
    RETURN NEW;
  END IF;

  -- Insert event
  INSERT INTO public.kayla_event_queue (event_type, payload, target_service, record_id)
  VALUES (_event_type, row_to_json(NEW)::jsonb, _target_service, _record_id);

  -- Pull CRON_SECRET from vault (matches the value used by the edge function's requireAdminOrCron guard)
  BEGIN
    SELECT decrypted_secret INTO _cron_secret
    FROM vault.decrypted_secrets
    WHERE name = 'CRON_SECRET'
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    _cron_secret := NULL;
  END;

  -- Fire edge function via pg_net with x-cron-secret so the processor's auth guard accepts it
  PERFORM net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-event-processor',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ',
      'Content-Type', 'application/json',
      'x-cron-secret', coalesce(_cron_secret, '')
    ),
    body := jsonb_build_object(
      'event_type', _event_type,
      'record_id', _record_id::text,
      'target_service', _target_service
    )
  );

  RETURN NEW;
END;
$$;