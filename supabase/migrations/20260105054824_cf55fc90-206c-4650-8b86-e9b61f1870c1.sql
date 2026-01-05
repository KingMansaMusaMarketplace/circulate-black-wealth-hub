-- Fix PUBLIC_DATA_EXPOSURE: Remove overly permissive public policy
-- This policy allows unauthenticated access to ALL columns including email, phone

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Public can view businesses" ON public.businesses;

-- Drop duplicate policies we may have created
DROP POLICY IF EXISTS "Anon users can view verified businesses public data" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can view verified businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owners can view their full business data" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;

-- The following policies already exist and provide proper security:
-- - "Authenticated users view verified businesses safely" (is_verified = true)
-- - "Owners manage businesses" (is_business_owner_or_manager check)  
-- - "Admins full access" (is_admin_secure check)
-- - "Owners view full business details" (owner/manager/admin check)

-- Add a policy for anonymous users to view ONLY verified businesses
-- They will still need to use safe queries to avoid seeing sensitive columns
CREATE POLICY "Anonymous can view verified businesses only"
  ON public.businesses
  FOR SELECT
  TO anon
  USING (is_verified = true);