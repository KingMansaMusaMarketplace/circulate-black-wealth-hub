-- =========================================================================
-- 1. Restrict column-level access to email/phone on public.businesses
-- =========================================================================
REVOKE SELECT ON public.businesses FROM anon, authenticated;

GRANT SELECT (
  id,
  owner_id,
  business_name,
  name,
  description,
  category,
  address,
  city,
  state,
  zip_code,
  website,
  logo_url,
  banner_url,
  is_verified,
  qr_code_id,
  qr_code_url,
  average_rating,
  review_count,
  created_at,
  updated_at,
  subscription_status,
  subscription_start_date,
  subscription_end_date,
  parent_business_id,
  location_type,
  location_name,
  location_manager_id,
  referral_code_used,
  referred_at,
  referral_commission_paid,
  is_founding_sponsor,
  founding_sponsor_since,
  listing_status,
  onboarding_completed_at,
  is_founding_member,
  founding_order,
  founding_joined_at,
  latitude,
  longitude,
  total_revenue_tracked,
  transaction_count
) ON public.businesses TO anon, authenticated;

-- email, phone deliberately excluded for anon/authenticated.
-- Owners/managers/admins read them via SECURITY DEFINER RPCs and views.
-- service_role keeps full access (bypasses column grants).

-- =========================================================================
-- 2. Block privilege escalation on public.user_roles
-- =========================================================================
DROP POLICY IF EXISTS "Block non-admin role mutations" ON public.user_roles;

CREATE POLICY "Block non-admin role mutations"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- 3. Lock search_path on tracked_visits_touch trigger function
-- =========================================================================
CREATE OR REPLACE FUNCTION public.tracked_visits_touch()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;