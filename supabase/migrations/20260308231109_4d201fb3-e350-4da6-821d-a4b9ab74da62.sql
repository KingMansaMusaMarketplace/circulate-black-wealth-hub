INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Leah & Louise', 'Leah & Louise',
  'Modern juke joint at Camp North End in Charlotte serving innovative Southern cuisine with live music, craft cocktails, and a vibrant atmosphere celebrating Black culture',
  'Restaurant',
  '1935 Camden Rd', 'Charlotte', 'NC', '28203',
  '(980) 309-0690', 'info@leahandlouise.com', 'https://leahandlouise.com',
  true, 4.7, 450,
  35.2200, -80.8593,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Soul Kuisine Cafe', 'Soul Kuisine Cafe',
  'Black-owned soul food cafe in Baltimore''s Station North Arts District, offering catering and dine-in Southern comfort food with a community-first mission',
  'Restaurant',
  '203 E North Ave', 'Baltimore', 'MD', '21202',
  '(443) 835-2725', 'info@soulkuisinecafe.com', 'https://soulkuisinecafe.com',
  true, 4.6, 180,
  39.3122, -76.6126,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);