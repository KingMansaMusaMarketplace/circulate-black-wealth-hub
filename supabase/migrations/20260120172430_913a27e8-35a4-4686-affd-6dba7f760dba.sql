-- Fix the overly permissive QR code scans policy
-- Require that the user is either setting themselves as the converted_user_id
-- or that the converted_user_id is null (tracking scan before conversion)

DROP POLICY IF EXISTS "Authenticated users can record QR scans" ON public.qr_code_scans;

CREATE POLICY "Authenticated users can record QR scans"
ON public.qr_code_scans
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can insert a scan where they are the converted user
  -- OR the converted_user_id is null (anonymous tracking)
  converted_user_id IS NULL OR converted_user_id = auth.uid()
);