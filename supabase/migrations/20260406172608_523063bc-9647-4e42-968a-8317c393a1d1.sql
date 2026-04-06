DROP VIEW IF EXISTS public.corporate_subscriptions_public;

CREATE VIEW public.corporate_subscriptions_public
WITH (security_invoker = on)
AS SELECT
    id,
    company_name,
    logo_url,
    website_url,
    tier,
    status,
    is_visible,
    display_priority,
    approval_status,
    logo_approved,
    landing_page_enabled,
    landing_page_slug,
    landing_page_headline,
    landing_page_description,
    landing_page_cta_text,
    landing_page_cta_url,
    landing_page_hero_image_url,
    is_founding_sponsor,
    featured_until,
    created_at,
    updated_at
FROM corporate_subscriptions;

DROP POLICY IF EXISTS "Public can view active visible sponsors" ON corporate_subscriptions;
CREATE POLICY "Authenticated can view active visible sponsors"
  ON corporate_subscriptions FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    AND is_visible = true
    AND logo_approved = true
    AND approval_status = 'approved'
  );

DROP POLICY IF EXISTS "Public can view enabled sponsor landing pages" ON corporate_subscriptions;
CREATE POLICY "Authenticated can view enabled sponsor landing pages"
  ON corporate_subscriptions FOR SELECT
  TO authenticated
  USING (
    landing_page_enabled = true
    AND landing_page_slug IS NOT NULL
    AND is_visible = true
    AND approval_status = 'approved'
  );