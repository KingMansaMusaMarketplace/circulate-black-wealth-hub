-- Insert Alcorn State University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Alcorn State University',
  'Alcorn State University', 
  'Founded in 1871, Alcorn State University is the oldest public historically Black land-grant university in the United States. Located in rural southwestern Mississippi near Lorman, Alcorn offers programs in agriculture, nursing, education, and STEM fields while honoring its rich heritage as a pioneering Black educational institution.',
  'University',
  '1000 ASU Drive',
  'Lorman', 'MS', '39096',
  '(601) 877-6100',
  'https://alcorn.edu/',
  '/images/businesses/alcorn-state-logo.png',
  '/images/businesses/alcorn-state-banner.jpg',
  31.8727, -91.1363,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Coahoma Community College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Coahoma Community College',
  'Coahoma Community College', 
  'Founded in 1949, Coahoma Community College is a public historically Black community college located in Clarksdale, Mississippi, in the heart of the Mississippi Delta. CCC offers associate degrees and workforce training programs, serving as a vital educational pathway for Delta residents with strong connections to the region''s cultural heritage.',
  'Community College',
  '3240 Friars Point Road',
  'Clarksdale', 'MS', '38614',
  '(662) 627-2571',
  'https://coahomacc.edu/',
  '/images/businesses/coahoma-cc-logo.png',
  '/images/businesses/coahoma-cc-banner.jpg',
  34.1926, -90.5551,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Hinds Community College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Hinds Community College',
  'Hinds Community College', 
  'Founded in 1917, Hinds Community College is Mississippi''s largest community college and a historically Black institution headquartered in Raymond. With multiple campuses across central Mississippi, Hinds offers over 170 academic and career-technical programs, serving as a gateway to higher education and workforce development.',
  'Community College',
  '501 East Main Street',
  'Raymond', 'MS', '39154',
  '(601) 857-5261',
  'https://hindscc.edu/',
  '/images/businesses/hinds-cc-logo.png',
  '/images/businesses/hinds-cc-banner.jpg',
  32.2596, -90.4157,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);