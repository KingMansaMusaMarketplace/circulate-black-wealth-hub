-- Complete the fix for qr_code_scans policies
-- Use the correct column name: converted_user_id

-- Allow authenticated users to insert QR scans
CREATE POLICY "Authenticated users can track QR code scans"
ON public.qr_code_scans FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anon users to also track QR scans (for anonymous scanning before sign-up)
CREATE POLICY "Anonymous users can track QR code scans"
ON public.qr_code_scans FOR INSERT
TO anon
WITH CHECK (true);

-- Allow the system to update scan conversions (only service role or admin should do this)
-- For authenticated users, they can only update scans where they are the converted user
CREATE POLICY "Users can update their converted QR scans"
ON public.qr_code_scans FOR UPDATE
TO authenticated
USING (auth.uid() = converted_user_id)
WITH CHECK (auth.uid() = converted_user_id);

-- Admins can update any QR scan
CREATE POLICY "Admins can update any QR code scans"
ON public.qr_code_scans FOR UPDATE
TO authenticated
USING (public.is_admin_secure());