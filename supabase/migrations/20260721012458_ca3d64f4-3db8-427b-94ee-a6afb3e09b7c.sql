DROP POLICY IF EXISTS "Anon users can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;

CREATE POLICY "Anon users can view non-flagged reviews"
ON public.reviews
FOR SELECT
TO anon
USING (is_flagged = false);

CREATE POLICY "Authenticated users can view non-flagged reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (is_flagged = false OR customer_id = auth.uid() OR public.is_admin_secure());