-- Explicitly recreate the view with SECURITY INVOKER
DROP VIEW IF EXISTS public.business_directory CASCADE;

-- Recreate with explicit SECURITY INVOKER
CREATE VIEW public.business_directory 
WITH (security_invoker = true) AS 
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