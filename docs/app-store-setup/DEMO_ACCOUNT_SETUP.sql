-- ============================================
-- DEMO ACCOUNT SETUP FOR APPLE APP REVIEW
-- ============================================
-- Email: testuser@example.com
-- Password: TestPass123!
-- 
-- INSTRUCTIONS:
-- 1. First, create the auth user manually in Supabase:
--    - Go to Authentication > Users > Add User
--    - Email: testuser@example.com
--    - Password: TestPass123!
--    - Auto Confirm User: YES
-- 
-- 2. Copy the User ID that was created
-- 
-- 3. Replace 'YOUR_USER_ID_HERE' below with the actual UUID
-- 
-- 4. Run this entire script in Supabase SQL Editor
-- ============================================

-- Set the demo user ID (REPLACE THIS!)
DO $$ 
DECLARE
  demo_user_id UUID := 'YOUR_USER_ID_HERE'; -- REPLACE WITH ACTUAL USER ID
  demo_business_id UUID;
  demo_qr_code_id UUID;
BEGIN

-- ============================================
-- 1. CREATE USER PROFILE
-- ============================================
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  user_type,
  role,
  bio,
  avatar_url,
  phone,
  city,
  state,
  zip_code,
  preferred_categories,
  interests,
  email_verified,
  created_at,
  updated_at
) VALUES (
  demo_user_id,
  'testuser@example.com',
  'Demo Business Owner',
  'business_owner',
  'user',
  'Demo account for Apple App Review - Full access to all business features including QR codes, analytics, and customer management.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  '(555) 123-4567',
  'Atlanta',
  'GA',
  '30303',
  ARRAY['Restaurant', 'Retail', 'Services'],
  ARRAY['Community Building', 'Economic Empowerment', 'Black-Owned Business'],
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- ============================================
-- 2. CREATE DEMO BUSINESS
-- ============================================
INSERT INTO public.businesses (
  id,
  owner_id,
  business_name,
  description,
  category,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  website,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  location_type,
  latitude,
  longitude,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  demo_user_id,
  'Mansa Musa Demo Restaurant',
  'Premium dining experience showcasing authentic cuisine. This demo business demonstrates all platform features including QR code generation, loyalty programs, customer analytics, and review management. Perfect for showcasing the full capabilities of the Mansa Musa Marketplace platform.',
  'Restaurant',
  '123 Peachtree Street NE',
  'Atlanta',
  'GA',
  '30303',
  '(555) 987-6543',
  'demo@mansamusamarketplace.com',
  'https://mansamusamarketplace.com',
  'https://api.dicebear.com/7.x/shapes/svg?seed=demobusiness',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  true,
  4.8,
  127,
  'single',
  33.7490,
  -84.3880,
  NOW() - INTERVAL '6 months',
  NOW()
) RETURNING id INTO demo_business_id;

-- ============================================
-- 3. CREATE QR CODES
-- ============================================
-- Loyalty Points QR Code
INSERT INTO public.qr_codes (
  id,
  business_id,
  code_type,
  points_value,
  discount_percentage,
  is_active,
  scan_limit,
  current_scans,
  expiration_date,
  qr_image_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  demo_business_id,
  'loyalty_points',
  50,
  0,
  true,
  1000,
  234,
  NOW() + INTERVAL '1 year',
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO_LOYALTY_001',
  NOW() - INTERVAL '3 months',
  NOW()
) RETURNING id INTO demo_qr_code_id;

-- Discount QR Code
INSERT INTO public.qr_codes (
  id,
  business_id,
  code_type,
  points_value,
  discount_percentage,
  is_active,
  scan_limit,
  current_scans,
  expiration_date,
  qr_image_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  demo_business_id,
  'discount',
  0,
  15,
  true,
  500,
  87,
  NOW() + INTERVAL '3 months',
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO_DISCOUNT_001',
  NOW() - INTERVAL '2 months',
  NOW()
);

-- Check-in QR Code
INSERT INTO public.qr_codes (
  id,
  business_id,
  code_type,
  points_value,
  discount_percentage,
  is_active,
  scan_limit,
  current_scans,
  expiration_date,
  qr_image_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  demo_business_id,
  'check_in',
  25,
  5,
  true,
  null,
  412,
  null,
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEMO_CHECKIN_001',
  NOW() - INTERVAL '4 months',
  NOW()
);

-- ============================================
-- 4. CREATE BUSINESS ANALYTICS
-- ============================================
-- Add weekly analytics for the past 8 weeks
DO $analytics$
DECLARE
  week_offset INT;
BEGIN
  FOR week_offset IN 0..7 LOOP
    INSERT INTO public.business_analytics (
      business_id,
      date_recorded,
      metric_type,
      metric_value,
      metadata
    ) VALUES
    (
      demo_business_id,
      (NOW() - (week_offset || ' weeks')::INTERVAL)::DATE,
      'profile_views',
      FLOOR(RANDOM() * 100 + 50)::INT,
      jsonb_build_object('source', 'mobile_app')
    ),
    (
      demo_business_id,
      (NOW() - (week_offset || ' weeks')::INTERVAL)::DATE,
      'qr_scans',
      FLOOR(RANDOM() * 50 + 20)::INT,
      jsonb_build_object('code_type', 'mixed')
    ),
    (
      demo_business_id,
      (NOW() - (week_offset || ' weeks')::INTERVAL)::DATE,
      'social_shares',
      FLOOR(RANDOM() * 15 + 5)::INT,
      jsonb_build_object('platforms', ARRAY['facebook', 'twitter', 'instagram'])
    );
  END LOOP;
END $analytics$;

-- ============================================
-- 5. CREATE REVIEWS
-- ============================================
-- Create some sample reviews (anonymous customers)
INSERT INTO public.reviews (
  id,
  business_id,
  customer_id,
  rating,
  review_text,
  is_verified,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  demo_business_id,
  gen_random_uuid(), -- Anonymous customer
  5,
  'Amazing experience! The food was exceptional and the service was outstanding. I love supporting Black-owned businesses through this platform.',
  true,
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks'
),
(
  gen_random_uuid(),
  demo_business_id,
  gen_random_uuid(),
  5,
  'Best restaurant in Atlanta! The loyalty rewards program is a great bonus. Highly recommend!',
  true,
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '1 month'
),
(
  gen_random_uuid(),
  demo_business_id,
  gen_random_uuid(),
  4,
  'Great atmosphere and delicious food. The QR code check-in was super easy to use.',
  true,
  NOW() - INTERVAL '3 weeks',
  NOW() - INTERVAL '3 weeks'
),
(
  gen_random_uuid(),
  demo_business_id,
  gen_random_uuid(),
  5,
  'This is exactly what our community needs! Supporting Black-owned businesses has never been easier.',
  true,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- ============================================
-- 6. CREATE NOTIFICATION PREFERENCES
-- ============================================
INSERT INTO public.notification_preferences (
  user_id,
  email_notifications,
  push_notifications,
  sms_notifications,
  marketing_emails,
  new_businesses,
  special_offers,
  loyalty_updates,
  event_reminders,
  location_based,
  weekly_digest,
  reward_expiry,
  point_milestones,
  created_at,
  updated_at
) VALUES (
  demo_user_id,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW();

-- ============================================
-- 7. CREATE BUSINESS AVAILABILITY
-- ============================================
-- Monday - Friday: 11 AM - 10 PM
INSERT INTO public.business_availability (
  business_id,
  day_of_week,
  start_time,
  end_time,
  is_available
)
SELECT
  demo_business_id,
  day,
  '11:00:00'::TIME,
  '22:00:00'::TIME,
  true
FROM generate_series(1, 5) AS day;

-- Saturday - Sunday: 10 AM - 11 PM
INSERT INTO public.business_availability (
  business_id,
  day_of_week,
  start_time,
  end_time,
  is_available
)
SELECT
  demo_business_id,
  day,
  '10:00:00'::TIME,
  '23:00:00'::TIME,
  true
FROM generate_series(6, 7) AS day;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
RAISE NOTICE '✅ Demo account setup completed successfully!';
RAISE NOTICE 'Business ID: %', demo_business_id;
RAISE NOTICE '';
RAISE NOTICE '📋 DEMO ACCOUNT CREDENTIALS:';
RAISE NOTICE 'Email: testuser@example.com';
RAISE NOTICE 'Password: TestPass123!';
RAISE NOTICE '';
RAISE NOTICE '🎯 FEATURES AVAILABLE:';
RAISE NOTICE '- Complete business profile';
RAISE NOTICE '- 3 active QR codes (loyalty, discount, check-in)';
RAISE NOTICE '- 8 weeks of analytics data';
RAISE NOTICE '- 4 verified customer reviews (4.8★ average)';
RAISE NOTICE '- Business hours configured';
RAISE NOTICE '- Notification preferences set';
RAISE NOTICE '';
RAISE NOTICE '✅ Ready for Apple App Review!';

END $$;
