
INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, is_verified, listing_status,
  latitude, longitude, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-300000000004',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'I-57 Rib House',
  'I-57 Rib House',
  'Real, no frills barbecue on Chicago''s South Side. Famous for tips (pork or turkey), hot links, and combo meals — everything comes with bread and fries soaked in their signature sauce. Take-out, UberEats delivery, and catering available. Neighborhood''s favorite comfort food, seasoned to perfection.',
  'Restaurant',
  '1524 West 115th Street',
  'Chicago',
  'IL',
  '60643',
  '(773) 429-1111',
  'themjgroupinc@aol.com',
  'https://www.i57ribhousechicago.com',
  'https://images.squarespace-cdn.com/content/v1/5be0f25b1aef1d802ce0f176/1543288739989-44L9YTO208JTTCYAOHMY/i57-rib-house-best-top-bbq-south-side-chicago-carry-out-strategy-driven-marketing-restaurant.jpg?format=500w',
  '',
  true,
  'live',
  41.6845,
  -87.6570,
  now(),
  now()
);
