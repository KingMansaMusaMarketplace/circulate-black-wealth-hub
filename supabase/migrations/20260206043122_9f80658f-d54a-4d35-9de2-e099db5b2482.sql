-- Insert Kentucky State University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Kentucky State University',
  'Kentucky State University', 
  'Founded in 1886, Kentucky State University is a public HBCU in Frankfort, Kentucky. Known as the "Small But Mighty" institution, KSU offers over 60 programs of study and is home to land-grant programs in aquaculture research, organic agriculture, and public policy.',
  'University',
  '400 East Main Street',
  'Frankfort', 'KY', '40601',
  '(502) 597-6000',
  'https://kysu.edu/',
  '/images/businesses/kentucky-state-logo.png',
  '/images/businesses/kentucky-state-banner.jpg',
  38.1969, -84.8643,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Simmons College of Kentucky
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Simmons College of Kentucky',
  'Simmons College of Kentucky', 
  'Founded in 1879, Simmons College of Kentucky is a private Baptist HBCU in Louisville. Originally Simmons University of Louisville, it is the only HBCU in Louisville and offers programs in business, theology, and liberal arts with a focus on community engagement and spiritual development.',
  'University',
  '1018 South 7th Street',
  'Louisville', 'KY', '40203',
  '(502) 776-1443',
  'https://simmonscollegeky.edu/',
  '/images/businesses/simmons-college-ky-logo.png',
  '/images/businesses/simmons-college-ky-banner.jpg',
  38.2394, -85.7595,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);