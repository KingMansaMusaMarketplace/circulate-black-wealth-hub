-- Fix remaining overly permissive policies with proper data validation
-- These are intentionally public forms but need input validation

-- 1. business_contact_requests - Validate business exists and required fields
DROP POLICY IF EXISTS "Anyone can create contact requests" ON public.business_contact_requests;
CREATE POLICY "Anyone can create valid contact requests"
ON public.business_contact_requests FOR INSERT
WITH CHECK (
  -- Validate business_id exists
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id)
  -- Validate required fields are not empty
  AND sender_name IS NOT NULL AND length(sender_name) > 0
  AND sender_email IS NOT NULL AND sender_email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND subject IS NOT NULL AND length(subject) > 0
  AND message IS NOT NULL AND length(message) > 0
  -- Prevent overriding status/timestamps
  AND status = 'pending'
  AND read_at IS NULL
  AND replied_at IS NULL
);

-- 2. contact_submissions - Validate required fields and email format
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit valid contact form"
ON public.contact_submissions FOR INSERT
WITH CHECK (
  -- Validate required fields
  name IS NOT NULL AND length(name) > 0
  AND email IS NOT NULL AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND message IS NOT NULL AND length(message) > 0
  -- Prevent overriding status/timestamps
  AND status = 'pending'
  AND responded_at IS NULL
  AND responded_by IS NULL
);

-- 3. email_subscriptions - Validate email format and prevent manipulation
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.email_subscriptions;
CREATE POLICY "Anyone can subscribe with valid email"
ON public.email_subscriptions FOR INSERT
WITH CHECK (
  -- Validate email format
  email IS NOT NULL AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  -- Must be active subscription
  AND is_active = true
  -- Cannot set unsubscribed_at on insert
  AND unsubscribed_at IS NULL
);

-- 4. media_kit_requests - Validate required fields
DROP POLICY IF EXISTS "Anyone can submit access requests" ON public.media_kit_requests;
CREATE POLICY "Anyone can submit valid access requests"
ON public.media_kit_requests FOR INSERT
WITH CHECK (
  -- Validate required fields
  full_name IS NOT NULL AND length(full_name) > 0
  AND email IS NOT NULL AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND reason IS NOT NULL AND length(reason) > 0
  -- Prevent overriding admin fields
  AND status = 'pending'
  AND reviewed_at IS NULL
  AND reviewed_by IS NULL
  AND admin_notes IS NULL
  AND download_count = 0
  AND last_downloaded_at IS NULL
);