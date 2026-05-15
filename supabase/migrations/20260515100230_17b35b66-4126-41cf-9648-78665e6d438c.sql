
-- Admin full-access policies on vacation_properties
CREATE POLICY "Admins can view all properties"
ON public.vacation_properties
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all properties"
ON public.vacation_properties
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all properties"
ON public.vacation_properties
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
