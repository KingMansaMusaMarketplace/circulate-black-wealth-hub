-- Revert business_directory to invoker-security to satisfy linter and existing security posture
CREATE OR REPLACE VIEW public.business_directory
WITH (security_invoker = true)
AS
SELECT
  b.id,
  b.business_name,
  b.name,
  b.description,
  b.category,
  b.address,
  b.city,
  b.state,
  b.zip_code,
  b.phone,
  b.email,
  b.website,
  b.logo_url,
  b.banner_url,
  b.is_verified,
  b.average_rating,
  b.review_count,
  b.created_at,
  b.updated_at,
  b.latitude,
  b.longitude,
  b.listing_status,
  b.is_founding_member,
  b.is_founding_sponsor
FROM public.businesses b
WHERE b.is_verified = true OR b.listing_status = 'live';