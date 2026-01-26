-- ==============================================
-- SECURITY FIX 1: businesses table contact exposure
-- Drop existing view first, then recreate with safe columns
-- ==============================================

-- Drop existing view to avoid column mismatch issues
DROP VIEW IF EXISTS public.businesses_public_safe CASCADE;

-- Create a public-safe view that excludes sensitive PII (email, phone)
CREATE VIEW public.businesses_public_safe
WITH (security_invoker = on) AS
SELECT 
  id,
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
  average_rating,
  review_count,
  created_at,
  updated_at,
  subscription_status,
  is_founding_sponsor,
  is_founding_member,
  founding_order,
  listing_status
  -- Excludes: owner_id, email, phone, qr_code_id, qr_code_url, referral info
FROM public.businesses
WHERE is_verified = true OR listing_status = 'live';

-- Grant anon access to safe view only (no direct access to businesses table for anon)
GRANT SELECT ON public.businesses_public_safe TO anon;
GRANT SELECT ON public.businesses_public_safe TO authenticated;

-- Drop the overly permissive anonymous policy on businesses table
DROP POLICY IF EXISTS "Anonymous can view public businesses" ON public.businesses;

-- ==============================================
-- SECURITY FIX 2: b2b_web_search_cache exposure
-- Restrict to authenticated users only
-- ==============================================

-- Drop the permissive anonymous policy
DROP POLICY IF EXISTS "Anyone can read search cache" ON public.b2b_web_search_cache;

-- Create restrictive policy: Only authenticated users can access
CREATE POLICY "Authenticated users can view search cache"
ON public.b2b_web_search_cache
FOR SELECT
TO authenticated
USING (true);

-- ==============================================
-- SECURITY FIX 3: businesses_full_details view exposure
-- Recreate with security_invoker to enforce RLS
-- ==============================================

-- Drop the existing view
DROP VIEW IF EXISTS public.businesses_full_details CASCADE;

-- Recreate view with security_invoker to enforce RLS from underlying tables
CREATE VIEW public.businesses_full_details
WITH (security_invoker = on) AS
SELECT 
  b.*,
  p.full_name as owner_name,
  p.avatar_url as owner_avatar
FROM public.businesses b
LEFT JOIN public.profiles p ON b.owner_id = p.id;

-- Only authenticated users can access full details (RLS on businesses table enforces actual access)
GRANT SELECT ON public.businesses_full_details TO authenticated;

-- Explicitly revoke anon access
REVOKE ALL ON public.businesses_full_details FROM anon;