
-- Insert University of the Virgin Islands
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'University of the Virgin Islands',
  'University of the Virgin Islands', 
  'Founded in 1962, the University of the Virgin Islands is the only public university in the US Virgin Islands and one of only four HBCUs outside the continental United States. With campuses on St. Thomas and St. Croix, UVI offers programs in marine science, business, education, and the liberal arts, providing students with a unique Caribbean educational experience while maintaining American accreditation standards.',
  'University',
  '2 John Brewers Bay',
  'Charlotte Amalie', 'VI', '00802',
  '(340) 776-9200',
  'https://uvi.edu/',
  '/images/businesses/uvi-logo.png',
  '/images/businesses/uvi-banner.jpg',
  18.3419, -64.9731,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Hampton University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Hampton University',
  'Hampton University', 
  'Founded in 1868, Hampton University is a prestigious private historically Black university on the Virginia Peninsula overlooking the Chesapeake Bay. Home to the historic Emancipation Oak where the Emancipation Proclamation was first read to the local community, Hampton offers over 50 programs and is renowned for its schools of business, pharmacy, nursing, and architecture. Notable alumni include Booker T. Washington.',
  'University',
  '100 East Queen Street',
  'Hampton', 'VA', '23668',
  '(757) 727-5000',
  'https://hamptonu.edu/',
  '/images/businesses/hampton-logo.png',
  '/images/businesses/hampton-banner.jpg',
  37.0218, -76.3374,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);
