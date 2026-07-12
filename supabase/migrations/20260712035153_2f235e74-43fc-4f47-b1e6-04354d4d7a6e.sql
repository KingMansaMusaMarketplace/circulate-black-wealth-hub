
-- Restrict base property_availability SELECT to hosts/admins; public reads go through property_availability_public view
DROP POLICY IF EXISTS "Public can view availability without booking details" ON public.property_availability;
DROP POLICY IF EXISTS "Authenticated can view availability for active properties" ON public.property_availability;

-- Ensure public view is readable
GRANT SELECT ON public.property_availability_public TO anon, authenticated;
