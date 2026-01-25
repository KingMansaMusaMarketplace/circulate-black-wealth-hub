-- Fix the remaining INSERT policy issue - make it more restrictive
DROP POLICY IF EXISTS "Authenticated users can insert clicks" ON public.partner_link_clicks;

-- Only allow inserts where the referral_code exists in directory_partners
CREATE POLICY "Validated click inserts only"
  ON public.partner_link_clicks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM directory_partners dp 
      WHERE dp.referral_code = partner_link_clicks.referral_code
    )
  );