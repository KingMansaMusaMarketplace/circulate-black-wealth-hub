
-- Tighten INSERT policies on attribution tables to prevent referral/commission fraud.
-- Require that (referral_code, sales_agent_id) pair matches a real, active sales_agents row.

-- qr_code_scans: replace loose INSERT policy
DROP POLICY IF EXISTS "Authenticated users can record QR scans" ON public.qr_code_scans;

CREATE POLICY "Authenticated users can record valid QR scans"
ON public.qr_code_scans
FOR INSERT
TO authenticated
WITH CHECK (
  ((converted_user_id IS NULL) OR (converted_user_id = auth.uid()))
  AND sales_agent_id IS NOT NULL
  AND referral_code IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.sales_agents sa
    WHERE sa.id = qr_code_scans.sales_agent_id
      AND sa.referral_code = qr_code_scans.referral_code
      AND sa.is_active = true
  )
);

-- referral_clicks: add strict INSERT policy (currently has none; inserts must go through a validated path)
DROP POLICY IF EXISTS "Authenticated users can record valid referral clicks" ON public.referral_clicks;

CREATE POLICY "Authenticated users can record valid referral clicks"
ON public.referral_clicks
FOR INSERT
TO authenticated
WITH CHECK (
  ((converted_user_id IS NULL) OR (converted_user_id = auth.uid()))
  AND sales_agent_id IS NOT NULL
  AND referral_code IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.sales_agents sa
    WHERE sa.id = referral_clicks.sales_agent_id
      AND sa.referral_code = referral_clicks.referral_code
      AND sa.is_active = true
  )
);
