
INSERT INTO public.businesses (
  id, owner_id, business_name, name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url,
  latitude, longitude,
  is_verified, listing_status,
  average_rating, review_count,
  created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'BMO - Crete Main St',
  'BMO - Crete Main St',
  'Full-service BMO bank branch offering personal and business banking, loans, mortgages, and financial planning services.',
  'Financial Services',
  '1380 Main Street',
  'Crete',
  'IL',
  '60417',
  '(708) 672-7272',
  'info@bmo.com',
  'https://usbranches.bmo.com/il/crete/bmous979/',
  'https://logo.clearbit.com/bmo.com',
  '/images/businesses/bmo-crete-banner.png',
  41.44349,
  -87.63145,
  true,
  'live',
  4.5,
  15,
  now(),
  now()
);
