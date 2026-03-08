INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Detroit Soul', 'Detroit Soul',
  'Acclaimed Detroit soul food restaurant serving hearty, healthy portions of down-home cuisine using locally sourced farm-fresh ingredients with down-South hospitality',
  'Restaurant',
  '2900 Eight Mile Rd', 'Detroit', 'MI', '48234',
  '(313) 366-5600', 'info@detroitsoul.net', 'https://detroitsoul.net',
  true, 4.6, 222,
  42.4467, -83.0888,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Honeysuckle Provisions', 'Honeysuckle Provisions',
  'Chef Omar Tate''s acclaimed West Philadelphia restaurant telling the story of Blackness in America through food, featuring innovative breads, specialty meals, and a celebration of Black foodways',
  'Restaurant',
  '4800 Baltimore Ave', 'Philadelphia', 'PA', '19143',
  '(215) 515-8255', 'info@honeysuckleprovisions.com', 'https://www.honeysuckleprovisions.com',
  true, 4.8, 190,
  39.9492, -75.2195,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);