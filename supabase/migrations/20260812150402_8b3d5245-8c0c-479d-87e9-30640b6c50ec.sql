INSERT INTO public.businesses (
  id, owner_id, name, business_name, description, category, city, state,
  website, banner_url, logo_url, is_verified, listing_status,
  average_rating, review_count
) VALUES (
  gen_random_uuid(),
  (SELECT owner_id FROM public.businesses WHERE id = 'ba298158-c785-48bf-87f2-830ae35f96a6'),
  'Martha''s Vineyard Comedy Fest',
  'Martha''s Vineyard Comedy Fest',
  'The Martha''s Vineyard Comedy Fest is an annual Black-owned comedy festival on Martha''s Vineyard featuring nationally touring comedians, live shows, and community events celebrating joy, culture, and laughter.',
  'Entertainment & Arts',
  'Oak Bluffs',
  'MA',
  'https://marthasvineyardcomedy.com/',
  'https://marthasvineyardcomedy.com/wp-content/uploads/2025/11/martha-vineyard-comedy-fest-home-scaled.png',
  'https://marthasvineyardcomedy.com/wp-content/uploads/2024/11/cropped-14Year_Annual_Logo.png',
  true,
  'live',
  5.0,
  0
) RETURNING id;