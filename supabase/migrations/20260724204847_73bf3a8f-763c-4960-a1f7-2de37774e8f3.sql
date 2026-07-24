-- Restore public newsletter signup while keeping validation and rate/format limits
CREATE POLICY "Anon can subscribe with valid email"
ON public.email_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND is_active = true
  AND unsubscribed_at IS NULL
  AND source IS NOT NULL
);

GRANT INSERT ON public.email_subscriptions TO anon;