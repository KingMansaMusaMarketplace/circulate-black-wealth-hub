-- Insert Claflin University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Claflin University',
  'Claflin University', 
  'Founded in 1869, Claflin University is a private historically Black university in Orangeburg, South Carolina affiliated with the United Methodist Church. Recognized as one of the top HBCUs in the nation, Claflin offers programs in business, STEM, education, and the liberal arts with a strong focus on student success and leadership development.',
  'University',
  '400 Magnolia Street',
  'Orangeburg', 'SC', '29115',
  '(803) 535-5000',
  'https://claflin.edu/',
  '/images/businesses/claflin-logo.png',
  '/images/businesses/claflin-banner.jpg',
  33.4918, -80.8551,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Clinton College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Clinton College',
  'Clinton College', 
  'Founded in 1894, Clinton College is a private historically Black college in Rock Hill, South Carolina affiliated with the African Methodist Episcopal Zion Church. This two-year institution offers associate degrees and certificate programs with a mission of providing accessible higher education and preparing students for transfer to four-year institutions.',
  'College',
  '1029 Crawford Road',
  'Rock Hill', 'SC', '29730',
  '(803) 327-7402',
  'https://clintoncollege.edu/',
  '/images/businesses/clinton-college-logo.png',
  '/images/businesses/clinton-college-banner.jpg',
  34.9249, -81.0251,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);