-- Fix the last overly permissive policy on coalition_points
DROP POLICY IF EXISTS "System can manage coalition points" ON public.coalition_points;

-- Coalition points should only be managed by authenticated users for their own records or admins
CREATE POLICY "Users can view own coalition points"
ON public.coalition_points FOR SELECT
TO authenticated
USING (auth.uid() = customer_id OR public.is_admin_secure());

CREATE POLICY "Users can update own coalition points"
ON public.coalition_points FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can manage all coalition points"
ON public.coalition_points FOR ALL
TO authenticated
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());