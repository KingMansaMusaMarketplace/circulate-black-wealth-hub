
INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, is_verified, listing_status,
  latitude, longitude, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-300000000003',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Garrett Popcorn Shops',
  'Garrett Popcorn Shops',
  'The home of original Chicago-style popcorn since 1949. Famous for the Garrett Mix — an irresistible blend of CheeseCorn and CaramelCrisp — handcrafted in old-fashioned copper kettles using secret family recipes and high-quality local ingredients.',
  'Restaurant',
  '835 Michigan Ave',
  'Chicago',
  'IL',
  '60611',
  '(888) 476-7267',
  'info@garrettpopcorn.com',
  'https://www.garrettpopcorn.com',
  'https://www.garrettpopcorn.com/on/demandware.static/Sites-garrett-Site/-/default/images/garrett-logo.svg',
  '',
  true,
  'live',
  41.8980,
  -87.6245,
  now(),
  now()
);
