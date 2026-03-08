INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Triple J''s Smokehouse', 'Triple J''s Smokehouse',
  'Northeast Houston''s favorite Texas barbecue since 1994, famous for spicy boudin, loaded baked potatoes, smoked ribs, and homemade sausage with a lively atmosphere',
  'Restaurant',
  '6715 Homestead Rd', 'Houston', 'TX', '77028',
  '(713) 635-6381', 'info@triplejsmokehouse.com', 'https://triplejsmokehouse.com',
  true, 4.8, 312,
  29.8125, -95.2983,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Burns Original BBQ', 'Burns Original BBQ',
  'Iconic Acres Homes barbecue institution since 1973, serving smoky Texas-style brisket, snappy sausage links, loaded baked potatoes, and dirty rice for over 50 years',
  'Restaurant',
  '8307 De Priest St', 'Houston', 'TX', '77088',
  '(713) 999-4506', 'info@burnsoriginalbbq.com', 'https://burnsoriginalbbq.com',
  true, 4.7, 445,
  29.8614, -95.4356,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);