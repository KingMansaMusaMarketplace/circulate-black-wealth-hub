
-- FIX 1: corporate_subscriptions - Hide Stripe IDs from public access
DROP VIEW IF EXISTS corporate_subscriptions_public;

CREATE VIEW corporate_subscriptions_public WITH (security_invoker = on) AS
SELECT
  id, company_name, logo_url, website_url, tier, status,
  is_visible, display_priority, approval_status, logo_approved,
  landing_page_enabled, landing_page_slug, landing_page_headline,
  landing_page_description, landing_page_cta_text, landing_page_cta_url,
  landing_page_hero_image_url,
  is_founding_sponsor, featured_until,
  created_at, updated_at, user_id
FROM corporate_subscriptions;

COMMENT ON VIEW corporate_subscriptions_public IS 'Public-facing view excluding stripe_customer_id and stripe_subscription_id. Uses security_invoker to respect RLS.';

-- FIX 2: b2b_web_search_cache - Scope access to search creator
ALTER TABLE b2b_web_search_cache
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Authenticated users can view search cache" ON b2b_web_search_cache;

CREATE POLICY "Users can view own search cache"
  ON b2b_web_search_cache FOR SELECT TO authenticated
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can insert search cache" ON b2b_web_search_cache;
CREATE POLICY "Authenticated users can insert search cache"
  ON b2b_web_search_cache FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
