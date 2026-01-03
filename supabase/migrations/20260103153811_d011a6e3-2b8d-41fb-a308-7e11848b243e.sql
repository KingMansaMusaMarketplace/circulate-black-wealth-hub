-- Fix the remaining profile policies and update businesses_public_safe view
-- Drop existing policy first to avoid conflict
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_secure());

-- No anonymous access to profiles
DROP POLICY IF EXISTS "Anonymous users cannot access profiles" ON public.profiles;
CREATE POLICY "Anonymous users cannot access profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Recreate businesses_public_safe view to ensure it doesn't expose sensitive data
DROP VIEW IF EXISTS public.businesses_public_safe;

CREATE VIEW public.businesses_public_safe
WITH (security_invoker = true)
AS
SELECT 
    id,
    business_name,
    description,
    category,
    address,
    city,
    state,
    zip_code,
    logo_url,
    banner_url,
    website,
    is_verified,
    average_rating,
    review_count,
    created_at
FROM businesses
WHERE (listing_status = 'active' OR listing_status IS NULL)
  AND is_verified = true;

GRANT SELECT ON public.businesses_public_safe TO anon, authenticated;

COMMENT ON VIEW public.businesses_public_safe IS 'Public-safe view of businesses excluding sensitive contact and subscription data.';