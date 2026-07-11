
-- Allow anonymous (logged-out) visitors to record funnel events for drop-off analytics.
-- user_id must be NULL for anon inserts (authenticated users already have their own policy).
GRANT INSERT ON public.funnel_events TO anon;

CREATE POLICY "Anonymous visitors can insert anonymous funnel events"
ON public.funnel_events
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);
