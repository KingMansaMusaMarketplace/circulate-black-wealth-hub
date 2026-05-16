
CREATE OR REPLACE FUNCTION public.has_confirmed_booking_for_property(_property_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vacation_bookings
    WHERE property_id = _property_id
      AND guest_id = auth.uid()
      AND status IN ('confirmed','completed')
  );
$$;

DROP POLICY IF EXISTS "Authenticated users can view active properties" ON public.vacation_properties;

CREATE POLICY "Restricted full-row access to active properties"
ON public.vacation_properties
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (
    host_id = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
    OR public.has_confirmed_booking_for_property(id)
  )
);

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
  listing_mode, base_monthly_rate, weekly_rate, service_tier
FROM public.vacation_properties
WHERE is_active = true;

GRANT SELECT ON public.vacation_properties_public TO anon, authenticated;

DROP POLICY IF EXISTS "Property photos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Business assets are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Public can view business assets" ON storage.objects;
DROP POLICY IF EXISTS "Marketing assets are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Public can view marketing assets" ON storage.objects;
DROP POLICY IF EXISTS "Marketing materials are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Public can view marketing materials" ON storage.objects;
DROP POLICY IF EXISTS "Sponsor logos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Public can view sponsor logos" ON storage.objects;
