-- Step 1: Revoke SELECT on sensitive internal columns from authenticated and anon roles
-- This prevents direct table queries from returning these columns
REVOKE SELECT (referral_code_used, referral_commission_paid, total_revenue_tracked, transaction_count) 
ON public.businesses FROM anon, authenticated;

-- Step 2: Update Realtime publication to only include safe columns
-- First remove the table from the publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.businesses;

-- Re-add with only safe columns (excluding sensitive financial/referral/contact data)
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at, subscription_status,
  name, parent_business_id, location_type, location_name, location_manager_id,
  listing_status, onboarding_completed_at,
  is_founding_member, founding_order, founding_joined_at,
  latitude, longitude
);

-- Step 3: Recreate businesses_public_safe view to explicitly exclude sensitive fields
DROP VIEW IF EXISTS public.businesses_public_safe;
CREATE OR REPLACE VIEW public.businesses_public_safe AS
SELECT 
  id, owner_id, business_name, name, description, category,
  address, city, state, zip_code, website,
  logo_url, banner_url, is_verified,
  qr_code_id, qr_code_url,
  average_rating, review_count,
  created_at, updated_at,
  parent_business_id, location_type, location_name, location_manager_id,
  listing_status, onboarding_completed_at,
  is_founding_member, founding_order, founding_joined_at,
  latitude, longitude
FROM public.businesses;

-- Grant access to the safe view
GRANT SELECT ON public.businesses_public_safe TO anon, authenticated;