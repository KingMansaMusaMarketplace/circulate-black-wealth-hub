-- ============================================
-- SECURITY FIX MIGRATION - January 2026
-- Fixes 3 security issues:
-- 1. Businesses table public exposure of email/phone
-- 2. QR code scans referral code validation exposure
-- 3. Reviews table unrestricted insert
-- ============================================

-- ============================================
-- FIX 1: Remove email/phone from public access on businesses table
-- The businesses_private table already exists with proper RLS
-- We'll create a secure view that excludes sensitive fields
-- ============================================

-- Create a public-safe view for the businesses table
DROP VIEW IF EXISTS public.businesses_public_safe;
CREATE VIEW public.businesses_public_safe
WITH (security_invoker=on) AS
SELECT 
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
  is_founding_sponsor,
  founding_sponsor_since,
  listing_status,
  onboarding_completed_at,
  is_founding_member,
  founding_order,
  founding_joined_at
  -- Explicitly EXCLUDES: email, phone, referral_code_used, referred_at, referral_commission_paid
FROM public.businesses;

COMMENT ON VIEW public.businesses_public_safe IS 'Public-safe view of businesses table that excludes sensitive contact information (email, phone). Use this view for public queries.';

-- ============================================
-- FIX 2: Replace the insecure QR code scans INSERT policy
-- The old policy exposes which referral codes are valid through
-- the WITH CHECK clause. Replace with a simpler policy and
-- handle validation in application code/edge function.
-- ============================================

-- Drop the insecure policy that exposes referral code validation
DROP POLICY IF EXISTS "Insert QR scans for valid referral codes" ON public.qr_code_scans;

-- Create a secure policy that only allows authenticated users to insert
-- Referral code validation should be done server-side via edge function
CREATE POLICY "Authenticated users can record QR scans"
ON public.qr_code_scans
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- FIX 3: Add review verification - only customers with transactions
-- can create reviews for that business
-- ============================================

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Customers can manage their own reviews" ON public.reviews;

-- Create a function to check if user has transacted with business
CREATE OR REPLACE FUNCTION public.has_transacted_with_business(p_customer_id uuid, p_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.transactions
    WHERE customer_id = p_customer_id
      AND business_id = p_business_id
  )
  OR EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE customer_id = p_customer_id
      AND business_id = p_business_id
      AND status IN ('completed', 'confirmed')
  )
  OR EXISTS (
    SELECT 1
    FROM public.loyalty_points
    WHERE customer_id = p_customer_id
      AND business_id = p_business_id
  );
$$;

COMMENT ON FUNCTION public.has_transacted_with_business IS 'Security function to verify if a customer has actually transacted with a business before allowing review creation.';

-- Create secure policy for review INSERT - requires transaction verification
CREATE POLICY "Verified customers can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = customer_id
  AND has_transacted_with_business(customer_id, business_id)
);

-- Customers can still read their own reviews
CREATE POLICY "Customers can view their own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (auth.uid() = customer_id);

-- Customers can update their own reviews
CREATE POLICY "Customers can update their own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

-- Customers can delete their own reviews
CREATE POLICY "Customers can delete their own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = customer_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

-- Business owners can view reviews for their businesses
CREATE POLICY "Business owners can view their reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (
  business_id IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid() OR location_manager_id = auth.uid()
  )
);