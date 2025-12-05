-- Insert a test corporate subscription for the admin user
INSERT INTO public.corporate_subscriptions (
  user_id,
  company_name,
  tier,
  status,
  approval_status,
  current_period_start,
  current_period_end,
  website_url
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Mansa Musa Marketplace',
  'gold',
  'active',
  'approved',
  now(),
  now() + interval '1 year',
  'https://mansamusamarketplace.com'
);