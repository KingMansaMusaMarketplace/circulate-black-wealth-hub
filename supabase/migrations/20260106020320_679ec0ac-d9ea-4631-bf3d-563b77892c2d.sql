-- Add policy for admins to insert leads (for CSV import)
CREATE POLICY "Admins can insert leads"
ON public.b2b_external_leads
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());