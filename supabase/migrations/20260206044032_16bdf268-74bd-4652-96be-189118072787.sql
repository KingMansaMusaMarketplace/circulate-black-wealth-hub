-- Insert University of Maryland Eastern Shore
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'University of Maryland Eastern Shore',
  'University of Maryland Eastern Shore', 
  'Founded in 1886, the University of Maryland Eastern Shore (UMES) is a public HBCU and part of the University System of Maryland. Located on Maryland''s scenic Eastern Shore, UMES is a land-grant institution known for programs in agriculture, aviation, hospitality, and STEM with strong research initiatives.',
  'University',
  '11868 Academic Oval',
  'Princess Anne', 'MD', '21853',
  '(410) 651-2200',
  'https://umes.edu/',
  '/images/businesses/umes-logo.png',
  '/images/businesses/umes-banner.jpg',
  38.2027, -75.6883,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Morgan State University
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Morgan State University',
  'Morgan State University', 
  'Founded in 1867, Morgan State University is Maryland''s preeminent public urban research university and the largest HBCU in the state. Located in Baltimore, Morgan is designated as a Doctoral Research Institution with programs in engineering, business, architecture, and the sciences, producing leaders in every field.',
  'University',
  '1700 East Cold Spring Lane',
  'Baltimore', 'MD', '21251',
  '(443) 885-3333',
  'https://morgan.edu/',
  '/images/businesses/morgan-state-logo.png',
  '/images/businesses/morgan-state-banner.jpg',
  39.3434, -76.5833,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);