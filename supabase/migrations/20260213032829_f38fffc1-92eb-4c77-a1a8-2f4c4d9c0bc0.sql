-- Tighten the overly permissive INSERT policy on stays_property_views
DROP POLICY IF EXISTS "Anyone can log property views" ON public.stays_property_views;

CREATE POLICY "Anyone can log property views"
ON public.stays_property_views
FOR INSERT
TO public
WITH CHECK (
  property_id IS NOT NULL
);