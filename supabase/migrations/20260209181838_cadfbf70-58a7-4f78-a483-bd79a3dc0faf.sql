
-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "System can update QR code scan conversions" ON public.qr_code_scans;

-- Create a restricted UPDATE policy: only admins can update scan records
CREATE POLICY "Only admins can update QR code scans"
  ON public.qr_code_scans
  FOR UPDATE
  TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());
