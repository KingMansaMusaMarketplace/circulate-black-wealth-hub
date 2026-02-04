-- Fix: Remove public access to businesses table, force anonymous users to use the secure view
-- This addresses the businesses_table_public_exposure error

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Public can view live businesses" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can view verified businesses" ON public.businesses;
DROP POLICY IF EXISTS "Public can view businesses" ON public.businesses;

-- Create a restricted policy: only authenticated users can read businesses directly
-- Anonymous users must use the business_directory view instead
CREATE POLICY "Authenticated users can view live businesses"
ON public.businesses
FOR SELECT
TO authenticated
USING (listing_status = 'live' OR is_verified = true OR owner_id = auth.uid());

-- Grant SELECT on the secure view to anon role (view already filters out PII)
GRANT SELECT ON public.business_directory TO anon;
GRANT SELECT ON public.business_directory TO authenticated;