CREATE TABLE public.kayla_safety_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  channel text NOT NULL,
  tier smallint NOT NULL,
  stages text[] NOT NULL DEFAULT '{}',
  rule_ids text[] NOT NULL DEFAULT '{}',
  escalated_by text[] NOT NULL DEFAULT '{}',
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.kayla_safety_events TO authenticated;
GRANT ALL ON public.kayla_safety_events TO service_role;

ALTER TABLE public.kayla_safety_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read safety events"
ON public.kayla_safety_events
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE INDEX kayla_safety_events_user_recent_idx
  ON public.kayla_safety_events (user_id, created_at DESC);

-- Append-only: a recorded safety event can never be rewritten.
CREATE OR REPLACE FUNCTION public.kayla_safety_events_block_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'kayla_safety_events is append-only';
END;
$$;

CREATE TRIGGER kayla_safety_events_no_update
BEFORE UPDATE ON public.kayla_safety_events
FOR EACH ROW EXECUTE FUNCTION public.kayla_safety_events_block_update();