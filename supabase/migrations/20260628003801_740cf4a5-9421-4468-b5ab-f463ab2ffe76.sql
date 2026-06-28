DROP POLICY IF EXISTS "Anyone can insert link clicks" ON public.partner_link_clicks;
DROP POLICY IF EXISTS "Public can insert link clicks" ON public.partner_link_clicks;
DROP POLICY IF EXISTS "Allow link click inserts" ON public.partner_link_clicks;
DROP POLICY IF EXISTS "Insert link clicks" ON public.partner_link_clicks;
DROP POLICY IF EXISTS "partner_link_clicks_insert" ON public.partner_link_clicks;

CREATE POLICY "Link clicks must match referral code owner"
ON public.partner_link_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (
  partner_id = (
    SELECT id FROM public.directory_partners
    WHERE referral_code = partner_link_clicks.referral_code
    LIMIT 1
  )
);