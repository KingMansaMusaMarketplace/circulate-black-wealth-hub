DROP POLICY IF EXISTS "Anon users can view public businesses safe" ON public.businesses;
CREATE POLICY "Anon users can view public businesses"
ON public.businesses
FOR SELECT
TO anon
USING (listing_status = 'live' OR is_verified = true);