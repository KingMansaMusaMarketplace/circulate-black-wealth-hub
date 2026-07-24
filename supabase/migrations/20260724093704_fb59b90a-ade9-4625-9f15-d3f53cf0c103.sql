
-- Fix 1: email_subscriptions — require caller to own the email being subscribed
DROP POLICY IF EXISTS "Anyone can subscribe with valid email" ON public.email_subscriptions;

CREATE POLICY "Authenticated users subscribe own email"
ON public.email_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  email IS NOT NULL
  AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND is_active = true
  AND unsubscribed_at IS NULL
  AND auth.uid() IS NOT NULL
  AND email IN (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
);

-- Fix 2: noire_scheduled_rides — preferred drivers only see rides once confirmed/assigned to them
DROP POLICY IF EXISTS "Preferred drivers view scheduled rides" ON public.noire_scheduled_rides;

CREATE POLICY "Preferred drivers view confirmed scheduled rides"
ON public.noire_scheduled_rides
FOR SELECT
TO authenticated
USING (
  status IN ('confirmed','assigned','en_route','in_progress','completed')
  AND EXISTS (
    SELECT 1 FROM public.noir_drivers d
    WHERE d.id = noire_scheduled_rides.preferred_driver_id
      AND d.user_id = auth.uid()
  )
);
