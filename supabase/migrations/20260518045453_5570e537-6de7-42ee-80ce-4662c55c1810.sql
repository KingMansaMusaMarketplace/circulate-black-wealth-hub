
CREATE TABLE IF NOT EXISTS public.lease_saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label TEXT,
  city TEXT,
  min_rent NUMERIC,
  max_rent NUMERIC,
  bedrooms INTEGER,
  property_type TEXT,
  pets_allowed BOOLEAN,
  section_8_accepted BOOLEAN,
  furnished BOOLEAN,
  notify_email BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lease_saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own saved searches"
  ON public.lease_saved_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create their own saved searches"
  ON public.lease_saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update their own saved searches"
  ON public.lease_saved_searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own saved searches"
  ON public.lease_saved_searches FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lease_saved_searches_user ON public.lease_saved_searches(user_id);

CREATE TRIGGER trg_lease_saved_searches_updated_at
  BEFORE UPDATE ON public.lease_saved_searches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
