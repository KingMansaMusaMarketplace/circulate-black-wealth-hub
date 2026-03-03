
INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, is_verified, listing_status,
  latitude, longitude, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-300000000002',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Portillo''s',
  'Portillo''s',
  'Iconic Chicago street food restaurant famous for Chicago-style hot dogs, Italian beef sandwiches, char-broiled burgers, chocolate cake shakes, and more. A beloved institution since 1963.',
  'Restaurant',
  '100 W. Ontario St.',
  'Chicago',
  'IL',
  '60610',
  '(312) 587-8910',
  'info@portillos.com',
  'https://www.portillos.com',
  'https://www.portillos.com/cms/images/reskin/Portillos_Logo_2021.png',
  '',
  true,
  'live',
  41.8932,
  -87.6315,
  now(),
  now()
);
