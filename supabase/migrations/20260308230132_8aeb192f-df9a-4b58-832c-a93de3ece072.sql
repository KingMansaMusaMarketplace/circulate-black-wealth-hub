INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Southern National', 'Southern National',
  'Globally-inspired Southern cuisine featuring craft cocktails and a world-class wine program in Atlanta''s historic Summerhill neighborhood',
  'Restaurant',
  '72 Georgia Ave SE, Ste 100', 'Atlanta', 'GA', '30312',
  '(404) 566-0067', 'info@southernational.com', 'https://www.southernational.com',
  true, 4.8, 156,
  33.7395, -84.3798,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Oreatha''s At The Point', 'Oreatha''s At The Point',
  'Upscale soul food with global influences by Chef Deborah VanTrece, featuring Thai-seasoned catfish and craft cocktails in a stylish Cascade Heights setting',
  'Restaurant',
  '2287 Cascade Rd SW, Unit C', 'Atlanta', 'GA', '30311',
  '(404) 228-4852', 'info@oreathas.com', 'https://www.oreathas.com',
  true, 4.9, 203,
  33.7224, -84.4640,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);