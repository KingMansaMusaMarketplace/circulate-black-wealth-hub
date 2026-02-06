-- Fix Benedict College website URL (was incorrectly set to b-sc.edu which is Barber-Scotia)
UPDATE businesses 
SET website = 'https://benedict.edu/' 
WHERE id = '550a96bb-3b38-4036-84a8-d5820355034e';

-- Insert Bishop State Community College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Bishop State Community College',
  'Bishop State Community College', 
  'Founded in 1927, Bishop State Community College is a public historically Black community college in Mobile, Alabama. The college offers over 30 associate degree and certificate programs in healthcare, technology, business, and liberal arts, serving the Gulf Coast region with accessible higher education and workforce development.',
  'Community College',
  '351 North Broad Street',
  'Mobile', 'AL', '36603',
  '(251) 405-7000',
  'https://bishop.edu/',
  '/images/businesses/bishop-state-logo.png',
  '/images/businesses/bishop-state-banner.jpg',
  30.6954, -88.0399,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert J.F. Drake State Community and Technical College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'J.F. Drake State Community and Technical College',
  'J.F. Drake State Community and Technical College', 
  'Founded in 1961, J.F. Drake State Community and Technical College is a public historically Black community college in Huntsville, Alabama. Located in the heart of "Rocket City," Drake State offers technical and career programs aligned with the aerospace and defense industries, providing pathways to high-demand STEM careers.',
  'Community College',
  '3421 Meridian Street North',
  'Huntsville', 'AL', '35811',
  '(256) 539-8161',
  'https://drakestate.edu/',
  '/images/businesses/drake-state-logo.png',
  '/images/businesses/drake-state-banner.jpg',
  34.7687, -86.5689,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Miles College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Miles College',
  'Miles College', 
  'Founded in 1898, Miles College is a private historically Black liberal arts college in Fairfield, Alabama affiliated with the Christian Methodist Episcopal Church. Miles College played a pivotal role in the Civil Rights Movement and continues to develop leaders in business, education, law, and public service from its Birmingham-area campus.',
  'College',
  '5500 Myron Massey Boulevard',
  'Fairfield', 'AL', '35064',
  '(205) 929-1000',
  'https://miles.edu/',
  '/images/businesses/miles-college-logo.png',
  '/images/businesses/miles-college-banner.jpg',
  33.4859, -86.9119,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Stillman College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Stillman College',
  'Stillman College', 
  'Founded in 1876, Stillman College is a private historically Black liberal arts college in Tuscaloosa, Alabama affiliated with the Presbyterian Church (U.S.A.). Stillman offers undergraduate programs in business, education, humanities, natural sciences, and social sciences, emphasizing academic excellence and Christian values.',
  'College',
  '3601 Stillman Boulevard',
  'Tuscaloosa', 'AL', '35401',
  '(205) 349-4240',
  'https://stillman.edu/',
  '/images/businesses/stillman-logo.png',
  '/images/businesses/stillman-banner.jpg',
  33.1976, -87.5563,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Talladega College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Talladega College',
  'Talladega College', 
  'Founded in 1867, Talladega College is one of the oldest historically Black colleges in America, located in Talladega, Alabama. The college is home to the renowned Amistad murals by Hale Woodruff and offers programs in business, education, natural sciences, and the arts. Talladega continues its legacy of academic excellence and social justice.',
  'College',
  '627 West Battle Street',
  'Talladega', 'AL', '35160',
  '(256) 761-6100',
  'https://talladega.edu/',
  '/images/businesses/talladega-logo.png',
  '/images/businesses/talladega-banner.jpg',
  33.4362, -86.1058,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Arkansas Baptist College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Arkansas Baptist College',
  'Arkansas Baptist College', 
  'Founded in 1884, Arkansas Baptist College is a private historically Black liberal arts college in Little Rock, Arkansas affiliated with the Consolidated Missionary Baptist State Convention. ABC offers programs in business, criminal justice, education, and religious studies, maintaining its Baptist heritage while serving diverse learners.',
  'College',
  '1621 Dr. Martin Luther King Jr. Drive',
  'Little Rock', 'AR', '72202',
  '(501) 420-1200',
  'https://arkansasbaptist.edu/',
  '/images/businesses/arkansas-baptist-logo.png',
  '/images/businesses/arkansas-baptist-banner.jpg',
  34.7381, -92.2746,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Shorter College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Shorter College',
  'Shorter College', 
  'Founded in 1886, Shorter College is a private historically Black two-year college in North Little Rock, Arkansas affiliated with the African Methodist Episcopal Church. As one of the smallest HBCUs in the nation, Shorter offers associate degrees with a focus on providing accessible education and personalized attention to first-generation college students.',
  'College',
  '604 Locust Street',
  'North Little Rock', 'AR', '72114',
  '(501) 374-6305',
  'https://shortercollege.edu/',
  '/images/businesses/shorter-college-logo.png',
  '/images/businesses/shorter-college-banner.jpg',
  34.7695, -92.2668,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

-- Insert Barber-Scotia College
INSERT INTO businesses (
  name, business_name, description, category, 
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  listing_status, is_verified, owner_id
) VALUES (
  'Barber-Scotia College',
  'Barber-Scotia College', 
  'Founded in 1867, Barber-Scotia College is a private historically Black college in Concord, North Carolina affiliated with the Presbyterian Church (U.S.A.). Originally founded as Scotia Seminary for African American women, the college has a rich history of educating generations of leaders and continues to offer programs in business, education, and the liberal arts.',
  'College',
  '145 Cabarrus Avenue West',
  'Concord', 'NC', '28025',
  '(704) 789-2900',
  'https://b-sc.edu/',
  '/images/businesses/barber-scotia-logo.png',
  '/images/businesses/barber-scotia-banner.jpg',
  35.4088, -80.5795,
  'live', false,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);