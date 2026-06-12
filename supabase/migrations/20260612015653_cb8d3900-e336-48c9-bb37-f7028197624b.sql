
-- featured_placement_events: restrict INSERT to authenticated users tied to their own user_id
DROP POLICY IF EXISTS "anyone_can_log_featured_event" ON public.featured_placement_events;
CREATE POLICY "authenticated_users_log_featured_event"
ON public.featured_placement_events
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- funnel_events: restrict INSERT to authenticated users; user_id must be null or match auth.uid()
DROP POLICY IF EXISTS "Anyone can insert funnel events" ON public.funnel_events;
CREATE POLICY "Authenticated users can insert their own funnel events"
ON public.funnel_events
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- stays_property_views: restrict INSERT to authenticated users; viewer_id must be null or match auth.uid()
DROP POLICY IF EXISTS "Anyone can log property views" ON public.stays_property_views;
CREATE POLICY "Authenticated users can log their own property views"
ON public.stays_property_views
FOR INSERT
TO authenticated
WITH CHECK (property_id IS NOT NULL AND (viewer_id IS NULL OR viewer_id = auth.uid()));
