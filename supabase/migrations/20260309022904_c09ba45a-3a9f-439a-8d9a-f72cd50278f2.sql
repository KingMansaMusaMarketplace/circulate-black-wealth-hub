
-- Re-grant SELECT on businesses to anon, excluding email, phone, owner_id
-- First need to re-grant since REVOKE already ran
GRANT SELECT (
  id, business_name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at,
  subscription_status, subscription_start_date, subscription_end_date,
  name, parent_business_id, location_type, location_name, location_manager_id,
  referral_code_used, referred_at, referral_commission_paid,
  is_founding_sponsor, founding_sponsor_since, listing_status,
  onboarding_completed_at, is_founding_member, founding_order, founding_joined_at,
  latitude, longitude
) ON public.businesses TO anon;
