-- Restrict SELECT on businesses.email and businesses.phone to service_role only.
-- Public consumers must use the businesses_public_safe view (already exists).
-- Owners must read contact PII from public.businesses_private via existing RLS.

REVOKE SELECT ON public.businesses FROM anon, authenticated;

-- Re-grant SELECT on all columns EXCEPT email and phone
GRANT SELECT (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at,
  subscription_status, subscription_start_date, subscription_end_date,
  name, parent_business_id, location_type, location_name, location_manager_id,
  referral_code_used, referred_at, referral_commission_paid,
  is_founding_sponsor, founding_sponsor_since, listing_status,
  onboarding_completed_at, is_founding_member, founding_order, founding_joined_at,
  latitude, longitude, total_revenue_tracked, transaction_count,
  normalized_name, website_domain, slug,
  listing_rejection_reason, listing_reviewed_by, listing_reviewed_at
) ON public.businesses TO anon, authenticated;

-- Keep INSERT/UPDATE/DELETE for authenticated (owners manage their own rows via RLS)
GRANT INSERT, UPDATE, DELETE ON public.businesses TO authenticated;

-- Service role retains full access
GRANT ALL ON public.businesses TO service_role;
