-- Recreate business_directory view WITHOUT security_invoker
-- This allows anonymous users to view public businesses

DROP VIEW IF EXISTS public.business_directory CASCADE;

CREATE VIEW public.business_directory AS 
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
  latitude, 
  longitude, 
  listing_status, 
  is_founding_member, 
  is_founding_sponsor
FROM public.businesses
WHERE (is_verified = true OR listing_status = 'live');

-- Grant access to both anonymous and authenticated users
GRANT SELECT ON public.business_directory TO anon;
GRANT SELECT ON public.business_directory TO authenticated;

COMMENT ON VIEW public.business_directory IS 'Public view of verified/live businesses - accessible to anonymous users';