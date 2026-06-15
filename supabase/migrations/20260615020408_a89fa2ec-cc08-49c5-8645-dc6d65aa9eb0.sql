
-- Lock down sensitive columns on businesses
REVOKE SELECT ON public.businesses FROM anon, authenticated;
GRANT SELECT (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  phone, email, website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at,
  subscription_status, subscription_start_date, subscription_end_date,
  name, parent_business_id, location_type, location_name, location_manager_id,
  referral_code_used, referred_at,
  is_founding_sponsor, founding_sponsor_since, listing_status, onboarding_completed_at,
  is_founding_member, founding_order, founding_joined_at, latitude, longitude,
  normalized_name, website_domain, slug,
  listing_rejection_reason, listing_reviewed_by, listing_reviewed_at
) ON public.businesses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

-- Lock down sensitive columns on featured_placements
REVOKE SELECT ON public.featured_placements FROM anon, authenticated;
GRANT SELECT (
  id, business_id, owner_user_id, tier, category, city, priority_score,
  status, starts_at, ends_at, created_at, updated_at
) ON public.featured_placements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.featured_placements TO authenticated;
GRANT ALL ON public.featured_placements TO service_role;
