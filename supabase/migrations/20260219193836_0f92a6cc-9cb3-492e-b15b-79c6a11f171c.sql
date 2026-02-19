
INSERT INTO public.businesses (
  id,
  owner_id,
  business_name,
  name,
  category,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  website,
  description,
  is_verified,
  listing_status,
  created_at,
  updated_at
) VALUES (
  '8f42b1c3-5d9e-4a7b-b2e1-9c3f4d5a6e7b',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'National Black Farmers Association (NBFA)',
  'National Black Farmers Association (NBFA)',
  'Agriculture',
  'Baskerville, VA 23915',
  'Baskerville',
  'VA',
  '23915',
  '(804) 691-8528',
  'Johnwesleyboydjr@gmail.com',
  'https://www.blackfarmers.org',
  'Non-profit org representing African American farmers and families across the U.S. Advocates for civil rights, land retention, fair lending, agricultural education, and rural economic development for Black and small farmers.',
  true,
  'live',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
