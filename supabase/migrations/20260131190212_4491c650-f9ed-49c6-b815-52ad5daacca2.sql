-- Add RLS policy to allow public (anonymous) read access to businesses in the directory
-- This is needed so visitors can browse the directory without logging in

CREATE POLICY "Public can view live businesses"
ON public.businesses
FOR SELECT
TO anon
USING (
  listing_status = 'live' 
  OR is_verified = true
);