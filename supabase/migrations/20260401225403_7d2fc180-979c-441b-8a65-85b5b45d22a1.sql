
-- =============================================
-- FIX 1: businesses_full_details view - restrict sensitive columns
-- =============================================

-- Drop and recreate the view with security_invoker = false (default)
-- so we can use RLS on the underlying tables, but we'll use a SECURITY DEFINER function instead
DROP VIEW IF EXISTS public.businesses_full_details;

CREATE VIEW public.businesses_full_details
WITH (security_invoker = true)
AS
SELECT
  b.id,
  b.owner_id,
  b.business_name,
  b.description,
  b.category,
  b.address,
  b.city,
  b.state,
  b.zip_code,
  -- Only show sensitive fields to the owner
  CASE WHEN b.owner_id = auth.uid() OR public.is_admin_secure() THEN b.phone ELSE NULL END AS phone,
  CASE WHEN b.owner_id = auth.uid() OR public.is_admin_secure() THEN b.email ELSE NULL END AS email,
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
  b.subscription_status,
  b.subscription_start_date,
  b.subscription_end_date,
  b.name,
  b.parent_business_id,
  b.location_type,
  b.location_name,
  b.location_manager_id,
  CASE WHEN b.owner_id = auth.uid() OR public.is_admin_secure() THEN b.referral_code_used ELSE NULL END AS referral_code_used,
  b.referred_at,
  b.referral_commission_paid,
  b.is_founding_sponsor,
  b.founding_sponsor_since,
  b.listing_status,
  b.onboarding_completed_at,
  b.is_founding_member,
  b.founding_order,
  b.founding_joined_at,
  CASE WHEN b.owner_id = auth.uid() OR public.is_admin_secure() THEN p.full_name ELSE NULL END AS owner_name,
  CASE WHEN b.owner_id = auth.uid() OR public.is_admin_secure() THEN p.avatar_url ELSE NULL END AS owner_avatar
FROM businesses b
LEFT JOIN profiles p ON b.owner_id = p.id;

-- =============================================
-- FIX 2: b2b_external_leads - fix claim policy
-- =============================================

-- Drop the permissive policy that allows anon/any user to claim leads
DROP POLICY IF EXISTS "Users can claim leads" ON public.b2b_external_leads;

-- Create a SECURITY DEFINER function for safe lead claiming
CREATE OR REPLACE FUNCTION public.claim_b2b_lead(p_lead_id uuid, p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead RECORD;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;

  -- Find and validate the lead
  SELECT * INTO v_lead
  FROM b2b_external_leads
  WHERE id = p_lead_id
    AND claim_status = 'pending'
    AND claim_token = p_token
    AND claim_token_expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired claim token');
  END IF;

  -- Perform the claim
  UPDATE b2b_external_leads
  SET claim_status = 'claimed',
      claimed_by_user_id = v_user_id,
      claimed_at = now()
  WHERE id = p_lead_id;

  RETURN jsonb_build_object('success', true, 'lead_id', p_lead_id);
END;
$$;

-- =============================================
-- FIX 3: review_sentiment_analysis - remove public access
-- =============================================

DROP POLICY IF EXISTS "Public can view sentiment analysis" ON public.review_sentiment_analysis;

-- =============================================
-- FIX 4: kayla_profile_scores - restrict to owners
-- =============================================

DROP POLICY IF EXISTS "Anyone can view profile scores" ON public.kayla_profile_scores;

CREATE POLICY "Business owners can view their profile scores"
ON public.kayla_profile_scores
FOR SELECT
TO authenticated
USING (
  business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
  )
  OR public.is_admin_secure()
);
