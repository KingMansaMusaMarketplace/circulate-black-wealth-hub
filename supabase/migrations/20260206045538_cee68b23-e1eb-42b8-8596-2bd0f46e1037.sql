-- Insert Winston-Salem State University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Winston-Salem State University',
  'Winston-Salem State University', 
  'Founded in 1892, Winston-Salem State University is a public historically Black university in Winston-Salem, North Carolina. A constituent of the UNC System, WSSU is renowned for its nursing program, healthcare education, and STEM initiatives, preparing students for careers in health sciences and beyond.',
  'University',
  '601 S. Martin Luther King Jr. Drive',
  'Winston-Salem', 'NC', '27110',
  '(336) 750-2000',
  'https://wssu.edu/',
  '/images/businesses/wssu-logo.png',
  '/images/businesses/wssu-banner.jpg',
  36.0847, -80.2186,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Benedict College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Benedict College',
  'Benedict College', 
  'Founded in 1870, Benedict College is a private historically Black liberal arts college in Columbia, South Carolina. Affiliated with the American Baptist Churches USA, Benedict offers programs in business, STEM, communications, and education with a focus on leadership development and community service.',
  'College',
  '1600 Harden Street',
  'Columbia', 'SC', '29204',
  '(803) 256-4220',
  'https://b-sc.edu/',
  '/images/businesses/benedict-college-logo.png',
  '/images/businesses/benedict-college-banner.jpg',
  34.0151, -81.0248,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);