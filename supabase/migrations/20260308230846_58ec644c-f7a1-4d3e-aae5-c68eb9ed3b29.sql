INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Bamboo Walk Caribbean Restaurant', 'Bamboo Walk Caribbean Restaurant',
  'Black-owned upscale Caribbean restaurant in East Flatbush, Brooklyn featuring fine dining, cabana seating, and the first-ever Caribbean drive-thru in the Northeast, blending Jamaican and Haitian flavors',
  'Restaurant',
  '1343 Utica Ave', 'Brooklyn', 'NY', '11203',
  '(718) 369-0001', 'info@bamboowalk.biz', 'https://bamboowalk.com',
  true, 4.6, 450,
  40.6410, -73.9308,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Dooky Chase''s Restaurant', 'Dooky Chase''s Restaurant',
  'Legendary New Orleans Creole restaurant since 1941, founded by the late Leah Chase "Queen of Creole Cuisine," an iconic civil rights landmark serving gumbo, fried chicken, and Creole classics',
  'Restaurant',
  '2301 Orleans Ave', 'New Orleans', 'LA', '70119',
  '(504) 821-0600', 'info@dookychaserestaurants.com', 'https://www.dookychaserestaurants.com',
  true, 4.7, 1850,
  29.9680, -90.0785,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);