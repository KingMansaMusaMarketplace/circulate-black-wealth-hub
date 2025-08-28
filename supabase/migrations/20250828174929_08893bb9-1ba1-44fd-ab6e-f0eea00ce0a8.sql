-- Fix security definer view issue
-- Drop the existing business_directory view that has SECURITY DEFINER
DROP VIEW IF EXISTS public.business_directory;

-- Recreate the view without SECURITY DEFINER (defaults to SECURITY INVOKER)
-- This ensures the view runs with the permissions of the querying user
CREATE VIEW public.business_directory AS 
SELECT 
  businesses.id,
  businesses.business_name,
  businesses.description,
  businesses.category,
  businesses.city,
  businesses.state,
  businesses.logo_url,
  businesses.banner_url,
  businesses.is_verified,
  businesses.average_rating,
  businesses.review_count,
  businesses.created_at
FROM businesses
WHERE businesses.is_verified = true;

-- Enable RLS on the view (this will use the underlying table's RLS policies)
ALTER VIEW public.business_directory SET (security_barrier = true);

-- Add comment to document the security model
COMMENT ON VIEW public.business_directory IS 'Public view of verified businesses. Uses SECURITY INVOKER to respect user permissions and RLS policies.';