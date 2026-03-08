INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Auburn Angel', 'Auburn Angel',
  'Southern fine dining on historic Auburn Avenue featuring elevated comfort food, craft cocktails, and a sophisticated atmosphere perfect for date nights and special occasions',
  'Restaurant',
  '302 Auburn Ave NE', 'Atlanta', 'GA', '30303',
  '(404) 955-7123', 'info@auburnangel.com', 'https://www.auburnangel.com',
  true, 4.8, 187,
  33.7553, -84.3776,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Gatlin''s BBQ', 'Gatlin''s BBQ',
  'Family-owned Houston craft barbecue in Oak Forest since 2010, acclaimed for classic Southern BBQ with generous sides and a warm neighborhood cookout atmosphere',
  'Restaurant',
  '3510 Ella Blvd', 'Houston', 'TX', '77018',
  '(713) 869-4227', 'info@gatlinsbbq.com', 'https://gatlinsbbq.com',
  true, 4.7, 520,
  29.8173, -95.4163,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);