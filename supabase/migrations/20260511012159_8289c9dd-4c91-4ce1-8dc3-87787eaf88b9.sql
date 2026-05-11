
-- API access requests (public funnel)
CREATE TABLE public.api_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'starter',
  use_case TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

ALTER TABLE public.api_access_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert (form is open); reads/updates restricted to admins.
CREATE POLICY "anyone_can_request_api_access"
  ON public.api_access_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admins_view_api_access_requests"
  ON public.api_access_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_api_access_requests"
  ON public.api_access_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_api_access_requests_status_created
  ON public.api_access_requests(status, created_at DESC);

-- Featured Placement analytics events
CREATE TABLE public.featured_placement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID NOT NULL REFERENCES public.featured_placements(id) ON DELETE CASCADE,
  business_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click')),
  user_id UUID,
  session_id TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_placement_events ENABLE ROW LEVEL SECURITY;

-- Public can insert events (impressions/clicks tracked from any browser session).
CREATE POLICY "anyone_can_log_featured_event"
  ON public.featured_placement_events FOR INSERT
  WITH CHECK (true);

-- Business owners can read events for their own placements.
CREATE POLICY "owners_read_their_placement_events"
  ON public.featured_placement_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.featured_placements fp
      JOIN public.businesses b ON b.id = fp.business_id
      WHERE fp.id = featured_placement_events.placement_id
        AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "admins_read_all_featured_events"
  ON public.featured_placement_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_featured_events_placement_type_time
  ON public.featured_placement_events(placement_id, event_type, created_at DESC);

CREATE INDEX idx_featured_events_business_time
  ON public.featured_placement_events(business_id, created_at DESC);
