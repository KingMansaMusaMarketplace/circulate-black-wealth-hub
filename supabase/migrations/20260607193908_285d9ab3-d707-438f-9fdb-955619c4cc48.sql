DROP POLICY IF EXISTS "Anyone authenticated can create lease inquiries" ON public.lease_inquiries;

CREATE POLICY "Authenticated users create inquiries as themselves"
ON public.lease_inquiries
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.vacation_properties vp
    WHERE vp.id = lease_inquiries.property_id
      AND COALESCE(vp.is_active, true) = true
  )
);