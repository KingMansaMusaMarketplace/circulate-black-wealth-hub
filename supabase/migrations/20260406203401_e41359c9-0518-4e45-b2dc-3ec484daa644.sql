
-- Fix 1: Drop and recreate view to mask sensitive columns
DROP VIEW IF EXISTS public.businesses_full_details;
CREATE VIEW public.businesses_full_details WITH (security_invoker = on) AS
SELECT b.id, b.owner_id, b.business_name, b.description, b.category, b.address, b.city, b.state, b.zip_code,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.phone ELSE NULL::character varying END AS phone,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.email ELSE NULL::character varying END AS email,
    b.website, b.logo_url, b.banner_url, b.is_verified, b.qr_code_id, b.qr_code_url,
    b.average_rating, b.review_count, b.created_at, b.updated_at,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.subscription_status ELSE NULL::character varying END AS subscription_status,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.subscription_start_date ELSE NULL::timestamp with time zone END AS subscription_start_date,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.subscription_end_date ELSE NULL::timestamp with time zone END AS subscription_end_date,
    b.name, b.parent_business_id, b.location_type, b.location_name, b.location_manager_id,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.referral_code_used ELSE NULL::text END AS referral_code_used,
    b.referred_at,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.referral_commission_paid ELSE NULL::boolean END AS referral_commission_paid,
    b.is_founding_sponsor, b.founding_sponsor_since, b.listing_status, b.onboarding_completed_at,
    b.is_founding_member, b.founding_order, b.founding_joined_at,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.total_revenue_tracked ELSE NULL::numeric END AS total_revenue_tracked,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN b.transaction_count ELSE NULL::integer END AS transaction_count,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN p.full_name ELSE NULL::character varying END AS owner_name,
    CASE WHEN ((b.owner_id = auth.uid()) OR is_admin_secure()) THEN p.avatar_url ELSE NULL::character varying END AS owner_avatar,
    b.latitude, b.longitude
FROM businesses b LEFT JOIN profiles p ON (b.owner_id = p.id);

-- Fix 2: Restrict b2b_external_leads token columns
REVOKE SELECT ON public.b2b_external_leads FROM authenticated;
REVOKE SELECT ON public.b2b_external_leads FROM anon;
GRANT SELECT (
    id, business_name, business_description, category, city, state, zip_code, location,
    owner_name, owner_email, phone_number, website_url,
    source_query, source_id, contact_info, social_profiles, source_citations,
    confidence_score, data_quality_score, lead_score, priority_rank,
    is_converted, converted_business_id, is_invited, invited_at, invitation_count,
    last_invited_at, last_campaign_id, invitation_clicked_at, invitation_opened_at,
    is_visible_in_directory, listing_type, listing_expires_at,
    claim_status, claimed_at, claimed_by_user_id,
    email_status, call_status, called_at, call_notes,
    phone_valid, website_valid, last_validated_at, validation_status, validation_notes,
    last_enriched_at, verification_method,
    discovered_by_user_id, discovered_by_business_id, import_job_id,
    paid_at, payment_amount, created_at, updated_at
) ON public.b2b_external_leads TO authenticated;
GRANT ALL ON public.b2b_external_leads TO service_role;

-- Fix 3: Restrict business_invitations token column
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.business_invitations;
REVOKE SELECT ON public.business_invitations FROM authenticated;
GRANT SELECT (
    id, inviter_user_id, inviter_business_id, invitee_email, invitee_business_name,
    message, status, created_at, expires_at, opened_at, signed_up_at,
    converted_business_id, points_awarded
) ON public.business_invitations TO authenticated;
GRANT ALL ON public.business_invitations TO service_role;
