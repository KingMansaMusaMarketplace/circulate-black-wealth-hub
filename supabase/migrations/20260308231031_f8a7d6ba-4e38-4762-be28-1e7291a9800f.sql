INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Prince''s Hot Chicken', 'Prince''s Hot Chicken',
  'Nashville''s original hot chicken, crafted over 100 years ago from Thornton Prince''s legendary recipe — the birthplace of Nashville hot chicken with authentic heat and flavor',
  'Restaurant',
  '5814 Nolensville Pike', 'Nashville', 'TN', '37211',
  '(615) 810-9388', 'info@princeshotchicken.com', 'https://www.princeshotchicken.com',
  true, 4.5, 1200,
  36.0751, -86.7304,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Naomi''s Garden Restaurant & Lounge', 'Naomi''s Garden Restaurant & Lounge',
  'Black-owned Haitian and Caribbean restaurant in Miami''s Little Haiti, serving authentic legume, jerk chicken, baked chicken with house-made epis, and Caribbean classics in a vibrant lounge setting',
  'Restaurant',
  '650 NW 71st St', 'Miami', 'FL', '33150',
  '(305) 456-4715', 'info@naomismiami.com', 'https://naomismiami.com',
  true, 4.6, 340,
  25.8313, -80.2058,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);