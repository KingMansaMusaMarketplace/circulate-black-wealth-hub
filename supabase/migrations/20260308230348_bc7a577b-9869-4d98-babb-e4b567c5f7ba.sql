INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'The Busy Bee Cafe', 'The Busy Bee Cafe',
  'Legendary Atlanta soul food institution since the 1940s, known as one of Dr. Martin Luther King Jr.''s favorite restaurants, famous for its fried chicken and classic Southern sides',
  'Restaurant',
  '810 Martin Luther King Jr Dr SW', 'Atlanta', 'GA', '30314',
  '(404) 525-9212', 'info@thebusybeecafe.com', 'https://www.thebusybeecafe.com',
  true, 4.7, 671,
  33.7537, -84.4117,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Twisted Soul Cookhouse & Pours', 'Twisted Soul Cookhouse & Pours',
  'Michelin-recognized soul food restaurant by Chef Deborah VanTrece, reimagining Southern staples with global influences alongside craft cocktails',
  'Restaurant',
  '1133 Huff Rd NW, Ste D', 'Atlanta', 'GA', '30318',
  '(404) 350-5500', 'info@twistedsoulatl.com', 'https://www.twistedsoulcookhouseandpours.com',
  true, 4.6, 929,
  33.7808, -84.4232,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);