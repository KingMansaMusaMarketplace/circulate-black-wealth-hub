-- Fix: founding_member_slots was publicly readable, exposing Stripe customer/subscription IDs
-- Remove the public SELECT policy and replace with owner/admin-only access.
-- Provide a SECURITY DEFINER function for the public claimed-count needed by the UI.

DROP POLICY IF EXISTS "Public can read founding slots" ON public.founding_member_slots;

-- Owners can read their own slot
CREATE POLICY "Owners can read their own founding slot"
ON public.founding_member_slots
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can read all slots
CREATE POLICY "Admins can read all founding slots"
ON public.founding_member_slots
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Public count function (no sensitive data exposed)
CREATE OR REPLACE FUNCTION public.get_founding_slots_claimed_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.founding_member_slots;
$$;

GRANT EXECUTE ON FUNCTION public.get_founding_slots_claimed_count() TO anon, authenticated;