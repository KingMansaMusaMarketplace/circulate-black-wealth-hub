CREATE OR REPLACE VIEW public.vacation_properties_public
WITH (security_invoker = on) AS
SELECT
  id, host_id, title, description, property_type,
  city, state, zip_code, country,
  ROUND(latitude::numeric,  2) AS approx_latitude,
  ROUND(longitude::numeric, 2) AS approx_longitude,
  bedrooms, bathrooms, max_guests,
  base_nightly_rate, cleaning_fee, service_fee_percent,
  amenities, house_rules, photos,
  is_active, is_instant_book, is_verified,
  min_nights, max_nights, check_in_time, check_out_time,
  pets_allowed, pet_fee,
  average_rating, review_count,
  created_at, updated_at,
  cancellation_policy, security_deposit,
  listing_mode, base_monthly_rate, weekly_rate, service_tier,
  listing_status
FROM public.vacation_properties
WHERE is_active = true
  AND listing_status = 'approved';

GRANT SELECT ON public.vacation_properties_public TO anon, authenticated;