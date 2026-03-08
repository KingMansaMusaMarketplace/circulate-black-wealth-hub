INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Virtue Restaurant & Bar', 'Virtue Restaurant & Bar',
  'James Beard Award-winning Chef Erick Williams'' Southern American restaurant in Hyde Park, Chicago, celebrating Black Southern cooking with refined hospitality',
  'Restaurant',
  '1462 E 53rd St', 'Chicago', 'IL', '60615',
  '(773) 947-8831', 'info@virtuerestaurant.com', 'https://www.virtuerestaurant.com',
  true, 4.7, 1146,
  41.7996, -87.5864,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Almeda', 'Almeda',
  'Michelin Guide-recognized Afro-fusion restaurant in Washington DC serving inventive dishes like fried catfish and spaghetti, jerk pork tenderloin, and traditional soul food with a modern twist',
  'Restaurant',
  '828 Upshur St NW', 'Washington', 'DC', '20011',
  '(202) 733-5623', 'info@almedarestaurant.com', 'https://www.almedarestaurant.com',
  true, 4.8, 215,
  38.9426, -77.0242,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);