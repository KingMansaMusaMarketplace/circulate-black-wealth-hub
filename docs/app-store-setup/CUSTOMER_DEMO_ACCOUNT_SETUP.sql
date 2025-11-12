-- Customer Demo Account Setup for Apple App Review
-- This creates a fully functional customer account with sample data
-- 
-- INSTRUCTIONS:
-- 1. First create the auth user in Supabase Dashboard:
--    Email: customer.demo@mansamusa.com
--    Password: CustomerDemo123!
--    Auto-confirm: YES
-- 2. Copy the generated User ID
-- 3. Replace 'YOUR_USER_ID_HERE' below with that ID
-- 4. Run this entire script in Supabase SQL Editor

DO $$
DECLARE
  demo_customer_id UUID := 'YOUR_USER_ID_HERE'; -- REPLACE THIS
  sample_business_id UUID;
BEGIN
  -- Verify the UUID was updated
  IF demo_customer_id = 'YOUR_USER_ID_HERE'::UUID THEN
    RAISE EXCEPTION 'Please replace YOUR_USER_ID_HERE with the actual customer user ID';
  END IF;

  RAISE NOTICE 'Creating customer demo account for user ID: %', demo_customer_id;

  -- Create customer profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    user_type,
    phone,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    demo_customer_id,
    'customer.demo@mansamusa.com',
    'Demo Customer',
    'customer',
    '+14045551234',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=customer-demo',
    NOW() - INTERVAL '90 days',
    NOW()
  ) ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    user_type = EXCLUDED.user_type,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RAISE NOTICE '✓ Customer profile created';

  -- Create customer loyalty record with points
  INSERT INTO public.customer_loyalty (
    customer_id,
    total_points,
    points_earned,
    points_redeemed,
    tier,
    tier_progress,
    lifetime_points,
    created_at,
    updated_at
  ) VALUES (
    demo_customer_id,
    750,          -- Current available points
    1200,         -- Total earned
    450,          -- Already redeemed
    'silver',     -- Current tier
    75,           -- Progress to next tier (%)
    1200,         -- Lifetime total
    NOW() - INTERVAL '90 days',
    NOW()
  ) ON CONFLICT (customer_id) DO UPDATE
  SET
    total_points = EXCLUDED.total_points,
    points_earned = EXCLUDED.points_earned,
    points_redeemed = EXCLUDED.points_redeemed,
    tier = EXCLUDED.tier,
    tier_progress = EXCLUDED.tier_progress,
    lifetime_points = EXCLUDED.lifetime_points,
    updated_at = NOW();

  RAISE NOTICE '✓ Customer loyalty record created with 750 points';

  -- Find or create a sample business for favorites
  SELECT id INTO sample_business_id
  FROM public.businesses
  WHERE business_name ILIKE '%demo%' OR business_name ILIKE '%sample%'
  LIMIT 1;

  -- If we found a business, add it to favorites
  IF sample_business_id IS NOT NULL THEN
    INSERT INTO public.customer_favorites (
      customer_id,
      business_id,
      created_at
    ) VALUES (
      demo_customer_id,
      sample_business_id,
      NOW() - INTERVAL '30 days'
    ) ON CONFLICT (customer_id, business_id) DO NOTHING;

    RAISE NOTICE '✓ Added sample business to favorites';

    -- Add a sample review
    INSERT INTO public.business_reviews (
      business_id,
      customer_id,
      rating,
      review_text,
      created_at,
      updated_at
    ) VALUES (
      sample_business_id,
      demo_customer_id,
      5,
      'Great local business! Excellent service and quality products. Highly recommend supporting this establishment.',
      NOW() - INTERVAL '15 days',
      NOW() - INTERVAL '15 days'
    ) ON CONFLICT DO NOTHING;

    RAISE NOTICE '✓ Added sample review';

    -- Add customer visit records
    INSERT INTO public.customer_visits (
      customer_id,
      business_id,
      visit_date,
      points_earned,
      created_at
    ) VALUES
    (demo_customer_id, sample_business_id, NOW() - INTERVAL '7 days', 50, NOW() - INTERVAL '7 days'),
    (demo_customer_id, sample_business_id, NOW() - INTERVAL '21 days', 50, NOW() - INTERVAL '21 days'),
    (demo_customer_id, sample_business_id, NOW() - INTERVAL '45 days', 50, NOW() - INTERVAL '45 days')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✓ Added visit history';
  ELSE
    RAISE NOTICE 'No sample business found - skipping favorites and reviews';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════';
  RAISE NOTICE 'Customer Demo Account Setup Complete! ';
  RAISE NOTICE '════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Login Credentials:';
  RAISE NOTICE '  Email: customer.demo@mansamusa.com';
  RAISE NOTICE '  Password: CustomerDemo123!';
  RAISE NOTICE '';
  RAISE NOTICE 'Account Features:';
  RAISE NOTICE '  ✓ Full customer profile';
  RAISE NOTICE '  ✓ 750 loyalty points available';
  RAISE NOTICE '  ✓ Silver tier status';
  RAISE NOTICE '  ✓ Sample favorite business (if available)';
  RAISE NOTICE '  ✓ Sample review (if available)';
  RAISE NOTICE '  ✓ Visit history';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready for Apple App Review!';
  RAISE NOTICE '════════════════════════════════════════════════';

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '';
  RAISE NOTICE 'ERROR: %', SQLERRM;
  RAISE NOTICE '';
  RAISE NOTICE 'Common issues:';
  RAISE NOTICE '1. Did you replace YOUR_USER_ID_HERE with actual UUID?';
  RAISE NOTICE '2. Did you create the auth user first in Supabase Dashboard?';
  RAISE NOTICE '3. Check that all required tables exist';
  RAISE EXCEPTION 'Setup failed: %', SQLERRM;
END $$;
