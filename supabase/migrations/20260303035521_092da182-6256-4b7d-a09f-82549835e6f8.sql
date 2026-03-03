
-- =============================================
-- 1. Convert Security Definer Views to INVOKER
-- =============================================

DROP VIEW IF EXISTS public.business_directory;
CREATE VIEW public.business_directory
WITH (security_invoker = true)
AS
SELECT id, business_name, name, description, category, address, city, state, zip_code,
    phone, email, website, logo_url, banner_url, is_verified, average_rating, review_count,
    created_at, updated_at, latitude, longitude, listing_status, is_founding_member, is_founding_sponsor
FROM businesses
WHERE (is_verified = true) OR (listing_status = 'live'::text);

DROP VIEW IF EXISTS public.businesses_public_safe;
CREATE VIEW public.businesses_public_safe
WITH (security_invoker = true)
AS
SELECT id, business_name, name, description, category, address, city, state, zip_code,
    website, logo_url, banner_url, is_verified, average_rating, review_count, created_at,
    updated_at, subscription_status, is_founding_sponsor, is_founding_member, founding_order, listing_status
FROM businesses
WHERE (is_verified = true) OR (listing_status = 'live'::text);

DROP VIEW IF EXISTS public.businesses_full_details;
CREATE VIEW public.businesses_full_details
WITH (security_invoker = true)
AS
SELECT b.id, b.owner_id, b.business_name, b.description, b.category, b.address, b.city,
    b.state, b.zip_code, b.phone, b.email, b.website, b.logo_url, b.banner_url, b.is_verified,
    b.qr_code_id, b.qr_code_url, b.average_rating, b.review_count, b.created_at, b.updated_at,
    b.subscription_status, b.subscription_start_date, b.subscription_end_date, b.name,
    b.parent_business_id, b.location_type, b.location_name, b.location_manager_id,
    b.referral_code_used, b.referred_at, b.referral_commission_paid, b.is_founding_sponsor,
    b.founding_sponsor_since, b.listing_status, b.onboarding_completed_at, b.is_founding_member,
    b.founding_order, b.founding_joined_at,
    p.full_name AS owner_name, p.avatar_url AS owner_avatar
FROM businesses b
LEFT JOIN profiles p ON (b.owner_id = p.id);

DROP VIEW IF EXISTS public.partner_leaderboard;
CREATE VIEW public.partner_leaderboard
WITH (security_invoker = true)
AS
SELECT id, directory_name, logo_url, commission_tier, total_referrals, total_conversions,
    total_earnings, lifetime_referrals,
    CASE WHEN (total_referrals > 0) THEN round(((total_conversions::numeric / total_referrals::numeric) * 100::numeric), 1)
         ELSE 0::numeric END AS conversion_rate,
    rank() OVER (ORDER BY total_earnings DESC) AS earnings_rank,
    rank() OVER (ORDER BY total_referrals DESC) AS referrals_rank,
    created_at
FROM directory_partners dp
WHERE (status = 'active'::partner_status) AND (leaderboard_opt_in = true);

-- =============================================
-- 2. PII annotations + tighten noir_drivers RLS
-- =============================================

COMMENT ON COLUMN public.noir_drivers.drivers_license_number IS 'PII: Encrypted at application layer';
COMMENT ON COLUMN public.noir_drivers.license_plate IS 'PII: Encrypted at application layer';
COMMENT ON COLUMN public.noir_drivers.phone IS 'PII: Encrypted at application layer';
COMMENT ON COLUMN public.noir_drivers.email IS 'PII: Encrypted at application layer';

DROP POLICY IF EXISTS "Drivers can view own profile" ON public.noir_drivers;
CREATE POLICY "Drivers can view own profile"
ON public.noir_drivers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Drivers can update own profile" ON public.noir_drivers;
CREATE POLICY "Drivers can update own profile"
ON public.noir_drivers FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =============================================
-- 3. Tighten host_verification_requests RLS
-- =============================================

COMMENT ON COLUMN public.host_verification_requests.id_document_url IS 'PII: Contains identity document';
COMMENT ON COLUMN public.host_verification_requests.id_selfie_url IS 'PII: Contains identity selfie';
COMMENT ON COLUMN public.host_verification_requests.address_document_url IS 'PII: Contains address proof';

DROP POLICY IF EXISTS "Hosts can view own verification requests" ON public.host_verification_requests;
CREATE POLICY "Hosts can view own verification requests"
ON public.host_verification_requests FOR SELECT TO authenticated
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Hosts can insert own verification requests" ON public.host_verification_requests;
CREATE POLICY "Hosts can insert own verification requests"
ON public.host_verification_requests FOR INSERT TO authenticated
WITH CHECK (host_id = auth.uid());

DROP POLICY IF EXISTS "Only admins can update verification requests" ON public.host_verification_requests;
CREATE POLICY "Only admins can update verification requests"
ON public.host_verification_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 4. Fix pricing_recommendations INSERT policy
-- =============================================

DROP POLICY IF EXISTS "Users can insert pricing recommendations" ON public.pricing_recommendations;
CREATE POLICY "Users can insert pricing recommendations"
ON public.pricing_recommendations FOR INSERT TO authenticated
WITH CHECK (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
