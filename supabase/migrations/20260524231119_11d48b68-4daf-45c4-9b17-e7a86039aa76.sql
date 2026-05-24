DROP VIEW IF EXISTS public.businesses_public_safe;

CREATE VIEW public.businesses_public_safe
WITH (security_invoker = true)
AS
SELECT
  id, owner_id, business_name, name, description, category,
  address, city, state, zip_code, website, logo_url, banner_url,
  is_verified, qr_code_id, qr_code_url, average_rating, review_count,
  created_at, updated_at, parent_business_id, location_type, location_name,
  location_manager_id, listing_status, onboarding_completed_at,
  is_founding_member, founding_order, founding_joined_at,
  ROUND(latitude, 3)  AS latitude,
  ROUND(longitude, 3) AS longitude
FROM public.businesses;

GRANT SELECT ON public.businesses_public_safe TO anon, authenticated;