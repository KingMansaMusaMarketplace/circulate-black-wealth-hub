-- ═══════════════════════════════════════════════════════
-- KAYLA EVENT-DRIVEN ORCHESTRATION: Event Queue + Triggers
-- ═══════════════════════════════════════════════════════

-- 1. Create the central event queue table
CREATE TABLE IF NOT EXISTS public.kayla_event_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  target_service text NOT NULL,
  record_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error_message text,
  retry_count int NOT NULL DEFAULT 0,
  max_retries int NOT NULL DEFAULT 3
);

-- Indexes for efficient processing
CREATE INDEX idx_kayla_event_queue_status ON public.kayla_event_queue (status) WHERE status IN ('pending', 'failed');
CREATE INDEX idx_kayla_event_queue_created ON public.kayla_event_queue (created_at DESC);
CREATE INDEX idx_kayla_event_queue_type ON public.kayla_event_queue (event_type);
CREATE INDEX idx_kayla_event_queue_dedup ON public.kayla_event_queue (event_type, record_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.kayla_event_queue ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin access to kayla_event_queue"
  ON public.kayla_event_queue
  FOR ALL
  TO authenticated
  USING (public.is_admin_secure());

-- Service role full access (for triggers and edge functions)
CREATE POLICY "Service role access to kayla_event_queue"
  ON public.kayla_event_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Emit function with deduplication (5-second window)
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

  -- Fire edge function via pg_net
  PERFORM net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/kayla-event-processor',
    headers := '{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ","Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object(
      'event_type', _event_type,
      'record_id', _record_id::text,
      'target_service', _target_service
    )
  );

  RETURN NEW;
END;
$$;

-- 3. Create triggers on key tables

-- Reviews → Review Responder
CREATE TRIGGER kayla_on_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.kayla_emit_event('new_review', 'reviews');

-- Profiles → Onboarding Concierge
CREATE TRIGGER kayla_on_new_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.kayla_emit_event('new_signup', 'onboarding');

-- Bookings → Content Generator
CREATE TRIGGER kayla_on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.kayla_emit_event('new_booking', 'content');

-- Businesses → Quality Scorer
CREATE TRIGGER kayla_on_new_business
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.kayla_emit_event('new_business', 'scorer');

-- B2B Connections → Matchmaker
CREATE TRIGGER kayla_on_b2b_request
  AFTER INSERT ON public.b2b_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.kayla_emit_event('b2b_request', 'matchmaker');

-- Enable realtime for the event queue
ALTER PUBLICATION supabase_realtime ADD TABLE public.kayla_event_queue;