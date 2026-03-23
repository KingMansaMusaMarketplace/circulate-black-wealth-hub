-- Expand tier constraint to include all tiers
ALTER TABLE corporate_subscriptions DROP CONSTRAINT corporate_subscriptions_tier_check;
ALTER TABLE corporate_subscriptions ADD CONSTRAINT corporate_subscriptions_tier_check 
  CHECK (tier = ANY (ARRAY['bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text]));

-- Approve existing Gold sponsor's logo
UPDATE corporate_subscriptions SET logo_approved = true WHERE id = '1ba8138a-0cfc-4c32-8845-076d9e00520c';

-- Insert demo sponsors
INSERT INTO corporate_subscriptions (user_id, company_name, tier, status, is_visible, logo_approved, display_priority, website_url, approval_status)
SELECT 
  cs.user_id, demo.company_name, demo.tier, 'active', true, true, demo.display_priority, demo.website_url, 'approved'
FROM corporate_subscriptions cs
CROSS JOIN (VALUES
  ('Black Excellence Capital', 'platinum', 100, 'https://example.com'),
  ('Unity Tech Solutions', 'gold', 80, 'https://example.com'),
  ('Heritage Financial Group', 'gold', 70, 'https://example.com')
) AS demo(company_name, tier, display_priority, website_url)
WHERE cs.id = '1ba8138a-0cfc-4c32-8845-076d9e00520c';