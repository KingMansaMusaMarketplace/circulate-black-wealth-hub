-- Allow public read access to active, visible, approved sponsors (for sidebar/display)
CREATE POLICY "Public can view active visible sponsors"
ON public.corporate_subscriptions
FOR SELECT
TO anon, authenticated
USING (
  status = 'active' 
  AND is_visible = true 
  AND logo_approved = true
  AND approval_status = 'approved'
);