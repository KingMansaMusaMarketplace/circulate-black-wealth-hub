INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Sylvia''s Restaurant', 'Sylvia''s Restaurant',
  'Legendary Harlem soul food institution since 1962, founded by Sylvia Woods the "Queen of Soul Food," serving iconic fried chicken, catfish, and authentic Southern dishes for over 60 years',
  'Restaurant',
  '328 Malcolm X Blvd', 'New York', 'NY', '10027',
  '(212) 996-0660', 'info@sylviasrestaurant.com', 'https://sylviasrestaurant.com',
  true, 4.5, 2400,
  40.8087, -73.9441,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Dakar NOLA', 'Dakar NOLA',
  'No. 6 in North America''s 50 Best Restaurants 2025, modern Senegalese tasting menu by Chef Serigne Mbaye highlighting local seafood with cherished childhood memories from Senegal',
  'Restaurant',
  '3814 Magazine St', 'New Orleans', 'LA', '70115',
  '(504) 493-9396', 'reservations@dakarnola.com', 'https://www.dakarnola.com',
  true, 4.9, 380,
  29.9220, -90.0962,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);