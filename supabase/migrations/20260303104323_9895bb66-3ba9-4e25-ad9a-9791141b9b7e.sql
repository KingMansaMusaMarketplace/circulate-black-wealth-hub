
INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, is_verified, listing_status,
  latitude, longitude, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-300000000005',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Jodi''s Italian Ice Factory',
  'Jodi''s Italian Ice Factory',
  'Hammond''s favorite Italian ice destination specializing in authentic Italian ice, soft serve ice cream, gelato, and classic Philly cheesesteaks. A beloved neighborhood spot with vibrant flavors and a welcoming atmosphere. Open Tuesday through Sunday.',
  'Ice Cream Shop',
  '7322 Calumet Ave',
  'Hammond',
  'IN',
  '46324',
  '(219) 844-6344',
  'info@jodisice.com',
  'https://www.jodisice.com',
  'https://www.jodisice.com/uploads/b/b3ed3db44ae007b8e997a97fd88a3c172d08b26735d896f5379270aad1f90a3e/jodi''s%20letterhead%20logo_1633216013.jpg?width=400',
  '',
  true,
  'live',
  41.6168,
  -87.5328,
  now(),
  now()
);
