-- Allow anonymous (unauthenticated) users to view public businesses in the directory
CREATE POLICY "Anon users can view public businesses"
ON public.businesses
FOR SELECT
TO anon
USING (
  (is_verified = true) OR (listing_status = 'live')
);