INSERT INTO businesses (
  business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, is_verified, average_rating, review_count,
  latitude, longitude, owner_id
) VALUES
(
  'Miss Conduck', 'Miss Conduck',
  'Vibrant Caribbean restaurant on Atlanta''s Edgewood strip known for cocoritas, curry chicken, jerk dishes, and a lively atmosphere perfect for date nights and groups',
  'Restaurant',
  '357 Edgewood Ave SE', 'Atlanta', 'GA', '30312',
  '(404) 963-2710', 'info@missconduck.com', 'https://www.missconduck.com',
  true, 4.6, 285,
  33.7548, -84.3715,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
),
(
  'Charlene''s Bar & Grille', 'Charlene''s Bar & Grille',
  'Black and women-owned soul food restaurant and entertainment venue on Georgia Avenue in DC, where love is always the main ingredient with signature comfort food and live entertainment',
  'Restaurant',
  '2618 Georgia Ave NW', 'Washington', 'DC', '20001',
  '(202) 758-3889', 'info@charlenesbargrille.com', 'https://charlenes-bar-grille.goto-where.com',
  true, 4.6, 123,
  38.9254, -77.0234,
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);