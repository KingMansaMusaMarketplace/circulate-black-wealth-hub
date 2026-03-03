
INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, is_verified, listing_status,
  latitude, longitude, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-300000000001',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Apparel Redefined',
  'Apparel Redefined',
  'Custom apparel decoration with over 50 years of experience, specializing in athletic wear, screen printing, embroidery, and print-on-demand services for sports teams, corporate events, and retail brands.',
  'Fashion & Clothing',
  '4611 136th Street',
  'Crestwood',
  'IL',
  '60418',
  '(708) 598-2480',
  'sales@apparelredefined.com',
  'https://apparelredefined.com',
  'https://apparelredefined.com/wp-content/uploads/2024/01/AR-Final-Logo-transparent-e1706905003477.png',
  '',
  true,
  'live',
  41.6456,
  -87.7384,
  now(),
  now()
);
