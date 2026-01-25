-- Insert a demo partner for admin preview (without referral_link - it's generated)
INSERT INTO directory_partners (
  user_id,
  directory_name,
  directory_url,
  contact_email,
  contact_phone,
  description,
  status,
  tier,
  referral_code,
  flat_fee_per_signup,
  revenue_share_percent,
  total_referrals,
  total_conversions,
  total_earnings,
  pending_earnings,
  embed_token,
  embed_enabled,
  approved_at,
  approved_by
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Demo Black Business Directory',
  'https://blackbusinessdirectory.example.com',
  'demo@blackbusinessdirectory.com',
  '555-123-4567',
  'A demonstration partner showcasing directory features for African American businesses.',
  'active',
  'founding',
  'DEMO2025',
  25.00,
  10.0,
  47,
  23,
  1250.00,
  325.00,
  gen_random_uuid(),
  true,
  NOW(),
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert some demo referrals for the partner
INSERT INTO partner_referrals (partner_id, referred_email, referred_business_name, referral_code, is_converted, converted_at, conversion_type, flat_fee_earned, revenue_share_earned, total_earned, status, credited_at)
SELECT 
  dp.id,
  'business' || n || '@example.com',
  CASE n 
    WHEN 1 THEN 'Soul Food Kitchen'
    WHEN 2 THEN 'African Art Gallery'
    WHEN 3 THEN 'Heritage Hair Studio'
    WHEN 4 THEN 'Community Bookstore'
    WHEN 5 THEN 'Unity Financial Services'
  END,
  'DEMO2025',
  n <= 3,
  CASE WHEN n <= 3 THEN NOW() - (n || ' days')::interval ELSE NULL END,
  CASE WHEN n <= 3 THEN 'business_signup' ELSE NULL END,
  CASE WHEN n <= 3 THEN 25.00 ELSE 0 END,
  CASE WHEN n <= 3 THEN 15.00 ELSE 0 END,
  CASE WHEN n <= 3 THEN 40.00 ELSE 0 END,
  CASE WHEN n <= 3 THEN 'credited' ELSE 'pending' END,
  CASE WHEN n <= 3 THEN NOW() - (n || ' days')::interval ELSE NULL END
FROM directory_partners dp, generate_series(1, 5) AS n
WHERE dp.referral_code = 'DEMO2025';

-- Insert a demo payout (completed)
INSERT INTO partner_payouts (partner_id, amount, payout_method, status, payment_reference, processed_at)
SELECT 
  dp.id,
  500.00,
  'bank_transfer',
  'completed',
  'PAY-2025-001234',
  NOW() - interval '5 days'
FROM directory_partners dp
WHERE dp.referral_code = 'DEMO2025';

-- Insert a pending payout
INSERT INTO partner_payouts (partner_id, amount, payout_method, status)
SELECT 
  dp.id,
  150.00,
  'paypal',
  'pending'
FROM directory_partners dp
WHERE dp.referral_code = 'DEMO2025';