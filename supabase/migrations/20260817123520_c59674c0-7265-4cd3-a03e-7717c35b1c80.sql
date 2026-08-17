
WITH b AS (
  INSERT INTO public.businesses (
    owner_id, business_name, name, description, category, email, website,
    logo_url, banner_url, is_verified, listing_status, slug, average_rating, review_count
  ) VALUES (
    'bd72a75e-1310-4f40-9c74-380443b09d9b',
    'Kipani''s Kloset',
    'Kipani''s Kloset',
    'Kipani''s Kloset is a women''s mobile and online boutique built on quality, affordability and versatility. They carry all sizes and cater especially to the needs of curvy women. #yoursizeisbeautiful',
    'Retail',
    'kipaniskorner@yahoo.com',
    'https://kipanis-kloset.myshopify.com',
    'https://kipanis-kloset.myshopify.com/cdn/shop/files/received_1582359925446545.jpg?v=1645637927',
    'https://kipanis-kloset.myshopify.com/cdn/shop/files/received_1582359925446545.jpg?v=1645637927',
    true, 'live',
    'kipanis-kloset',
    0, 0
  )
  RETURNING id
)
INSERT INTO public.featured_placements (business_id, owner_user_id, tier, category, priority_score, status, starts_at, ends_at)
SELECT id, 'bd72a75e-1310-4f40-9c74-380443b09d9b', 'gold', 'Retail', 300, 'active', now(), now() + interval '1 year' FROM b;
