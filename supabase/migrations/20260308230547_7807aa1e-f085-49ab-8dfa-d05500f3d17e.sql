INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Bomb Biscuit Co.', 'Bomb Biscuit Co.',
  'Beloved Atlanta biscuit shop serving flaky buttermilk biscuits, lemon pepper chicken, golden waffles, and Southern breakfast favorites in Grant Park',
  'Restaurant',
  '519 Memorial Dr SE', 'Atlanta', 'GA', '30312',
  '(404) 590-1158', 'info@bombbiscuitatl.com', 'https://www.bombbiscuitatl.com',
  true, 4.8, 340,
  33.7396, -84.3663,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Cool Runnings Jamaican Grill', 'Cool Runnings Jamaican Grill',
  'Houston''s largest and most popular Jamaican and Caribbean restaurant, featured on Food Network''s Diners, Drive-Ins and Dives, serving authentic jerk chicken, oxtail, and brown stew',
  'Restaurant',
  '8270 W Bellfort Ave', 'Houston', 'TX', '77071',
  '(713) 541-1588', 'info@coolrunningsjamaicangrill.com', 'https://coolrunningsjamaicangrill.com',
  true, 4.6, 890,
  29.6726, -95.5172,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);