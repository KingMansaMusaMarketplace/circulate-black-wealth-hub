
-- 1. Fix business_impact_scorecards: restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view impact scorecards" ON business_impact_scorecards;
CREATE POLICY "Authenticated users can view impact scorecards"
  ON business_impact_scorecards FOR SELECT TO authenticated
  USING (true);

-- 2. Fix businesses table: remove duplicate/overly permissive SELECT policies
-- and replace with a single policy that hides financial columns via a secure view approach
-- First, drop the redundant SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view public businesses" ON businesses;

-- The remaining "Authenticated users can view live businesses" policy is the main one.
-- Financial columns cannot be hidden at RLS level (no column-level RLS in Postgres).
-- Create a secure view that excludes financial/subscription columns for public use.

-- Drop and recreate the public safe view to ensure financial columns are excluded
DROP VIEW IF EXISTS businesses_public_safe;
CREATE VIEW businesses_public_safe WITH (security_invoker = on) AS
SELECT
  id, owner_id, business_name, name, description, category,
  address, city, state, zip_code, website, logo_url, banner_url,
  is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at,
  parent_business_id, location_type, location_name, location_manager_id,
  listing_status, onboarding_completed_at, is_founding_member, founding_order,
  founding_joined_at, latitude, longitude, phone, email
FROM businesses;
-- NOTE: Excludes total_revenue_tracked, transaction_count, subscription_status,
-- subscription_end_date, referral_commission_paid, and other financial columns

COMMENT ON VIEW businesses_public_safe IS 'Public-facing view of businesses excluding financial metrics and subscription data. Uses security_invoker to respect RLS.';
