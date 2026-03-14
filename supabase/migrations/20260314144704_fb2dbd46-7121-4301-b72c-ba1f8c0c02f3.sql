-- Fix anonymous directory visibility and preserve privacy by masking sensitive fields
CREATE OR REPLACE VIEW public.business_directory
WITH (security_invoker = false)
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
  NULL::character varying AS phone,
  NULL::character varying AS email,
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