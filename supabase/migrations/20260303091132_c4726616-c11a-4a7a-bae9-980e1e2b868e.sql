-- Allow anonymous users to view public business listings in the directory
CREATE POLICY "Public can view live businesses"
ON public.businesses
FOR SELECT
TO anon
USING (is_verified = true OR listing_status = 'live');