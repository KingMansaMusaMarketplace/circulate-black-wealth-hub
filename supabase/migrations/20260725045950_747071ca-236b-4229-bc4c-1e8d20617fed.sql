
-- Lock down loyalty_engine_events INSERT to service_role only (prevent self-award)
DROP POLICY IF EXISTS "Authenticated users log loyalty events" ON public.loyalty_engine_events;

CREATE POLICY "Service role inserts loyalty events"
ON public.loyalty_engine_events
FOR INSERT
TO service_role
WITH CHECK (true);

-- Require admin role for admin_notification_preferences INSERT
DROP POLICY IF EXISTS "Admins can insert their own preferences" ON public.admin_notification_preferences;

CREATE POLICY "Admins can insert their own preferences"
ON public.admin_notification_preferences
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = admin_user_id
  AND public.is_admin_secure()
);
