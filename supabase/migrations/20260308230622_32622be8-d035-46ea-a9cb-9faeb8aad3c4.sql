INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Lucille''s', 'Lucille''s',
  'Acclaimed Southern restaurant by Chef Chris Williams in Houston''s Museum District, honoring his great-grandmother''s legacy with progressive Southern cuisine and craft cocktails',
  'Restaurant',
  '5512 La Branch St', 'Houston', 'TX', '77004',
  '(713) 568-2505', 'info@lucilleshouston.com', 'https://www.lucilleshouston.com',
  true, 4.7, 680,
  29.7322, -95.3808,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Zeke''s Kitchen & Bar', 'Zeke''s Kitchen & Bar',
  'First-generation Haitian-American family restaurant fusing authentic Haitian dishes with American favorites, featuring griot tacos, jerk chicken, and a fully stocked rum bar',
  'Restaurant',
  '4454 S Cobb Dr SE, Ste 101', 'Smyrna', 'GA', '30080',
  '(678) 293-5176', 'info@zekeskitchenandbar.com', 'https://www.zekeskitchenandbar.com',
  true, 4.7, 410,
  33.8365, -84.5242,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);