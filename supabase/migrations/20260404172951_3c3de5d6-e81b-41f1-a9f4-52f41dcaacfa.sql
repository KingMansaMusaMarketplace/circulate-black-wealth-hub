
-- Corporate subscriptions: create safe public view excluding Stripe IDs
CREATE OR REPLACE VIEW public.corporate_subscriptions_public
WITH (security_invoker = on) AS
SELECT
  id, company_name, logo_url, website_url, tier,
  approval_status, is_visible, status,
  display_priority, is_founding_sponsor,
  landing_page_slug, landing_page_headline, landing_page_description,
  landing_page_hero_image_url, landing_page_cta_text, landing_page_cta_url,
  landing_page_enabled, logo_approved, featured_until,
  created_at
FROM public.corporate_subscriptions
WHERE approval_status = 'approved' AND is_visible = true;

-- Restrict base table to authenticated
DROP POLICY IF EXISTS "Anyone can view approved sponsors" ON public.corporate_subscriptions;
CREATE POLICY "Authenticated users can view approved sponsors"
  ON public.corporate_subscriptions FOR SELECT
  TO authenticated
  USING (approval_status = 'approved' AND is_visible = true);
