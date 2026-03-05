-- Allow anonymous users to view reviews (needed for directory business detail pages)
CREATE POLICY "Anon users can view reviews"
ON public.reviews
FOR SELECT
TO anon
USING (true);