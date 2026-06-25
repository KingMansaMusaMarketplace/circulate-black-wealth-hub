
-- 1) businesses: remove internal/founding/referral fields from anon SELECT grant.
-- Keep them readable for authenticated users (UI may surface badges to logged-in users)
-- but never to anonymous public visitors.
REVOKE SELECT ON public.businesses FROM anon;
GRANT SELECT (
  id, owner_id, business_name, description, category, address, city, state, zip_code,
  phone, email, website, logo_url, banner_url, is_verified, qr_code_id, qr_code_url,
  average_rating, review_count, created_at, updated_at,
  subscription_status, subscription_start_date, subscription_end_date,
  name, parent_business_id, location_type, location_name, location_manager_id,
  is_founding_sponsor, listing_status, onboarding_completed_at,
  latitude, longitude, normalized_name, website_domain, slug,
  listing_rejection_reason, listing_reviewed_by, listing_reviewed_at
) ON public.businesses TO anon;

-- 2) featured_placement_events: require the placement to belong to a business
-- owned by the inserting user. Prevents fabricating analytics for other businesses.
DROP POLICY IF EXISTS "authenticated_users_log_featured_event" ON public.featured_placement_events;
CREATE POLICY "users_log_events_for_own_placements"
ON public.featured_placement_events
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.featured_placements fp
    JOIN public.businesses b ON b.id = fp.business_id
    WHERE fp.id = featured_placement_events.placement_id
      AND (fp.owner_user_id = auth.uid() OR b.owner_id = auth.uid())
  )
);
