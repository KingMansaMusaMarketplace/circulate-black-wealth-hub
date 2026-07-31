INSERT INTO public.businesses_private (business_id, owner_id, total_revenue_tracked, transaction_count)
SELECT b.id, b.owner_id, b.total_revenue_tracked, b.transaction_count
FROM public.businesses b
ON CONFLICT (business_id) DO UPDATE
SET total_revenue_tracked = COALESCE(NULLIF(EXCLUDED.total_revenue_tracked, 0), public.businesses_private.total_revenue_tracked),
    transaction_count     = COALESCE(NULLIF(EXCLUDED.transaction_count, 0), public.businesses_private.transaction_count);

DROP VIEW IF EXISTS public.businesses_full_details;

ALTER TABLE public.businesses DROP COLUMN IF EXISTS total_revenue_tracked;
ALTER TABLE public.businesses DROP COLUMN IF EXISTS transaction_count;

CREATE VIEW public.businesses_full_details
WITH (security_invoker = true)
AS
SELECT b.id,
    b.owner_id,
    b.business_name,
    b.description,
    b.category,
    b.address,
    b.city,
    b.state,
    b.zip_code,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.phone ELSE NULL::character varying END AS phone,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.email ELSE NULL::character varying END AS email,
    b.website,
    b.logo_url,
    b.banner_url,
    b.is_verified,
    b.qr_code_id,
    b.qr_code_url,
    b.average_rating,
    b.review_count,
    b.created_at,
    b.updated_at,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.subscription_status ELSE NULL::character varying END AS subscription_status,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.subscription_start_date ELSE NULL::timestamp with time zone END AS subscription_start_date,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.subscription_end_date ELSE NULL::timestamp with time zone END AS subscription_end_date,
    b.name,
    b.parent_business_id,
    b.location_type,
    b.location_name,
    b.location_manager_id,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.referral_code_used ELSE NULL::text END AS referral_code_used,
    b.referred_at,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN b.referral_commission_paid ELSE NULL::boolean END AS referral_commission_paid,
    b.is_founding_sponsor,
    b.founding_sponsor_since,
    b.listing_status,
    b.onboarding_completed_at,
    b.is_founding_member,
    b.founding_order,
    b.founding_joined_at,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN bp.total_revenue_tracked ELSE NULL::numeric END AS total_revenue_tracked,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN bp.transaction_count ELSE NULL::integer END AS transaction_count,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN p.full_name ELSE NULL::character varying END AS owner_name,
    CASE WHEN b.owner_id = auth.uid() OR is_admin_secure() THEN p.avatar_url ELSE NULL::character varying END AS owner_avatar,
    b.latitude,
    b.longitude
   FROM public.businesses b
     LEFT JOIN public.profiles p ON b.owner_id = p.id
     LEFT JOIN public.businesses_private bp ON bp.business_id = b.id;

GRANT SELECT ON public.businesses_full_details TO authenticated;
GRANT ALL ON public.businesses_full_details TO service_role;