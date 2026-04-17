ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

INSERT INTO public.businesses (
  name, business_name, description, category, city, state, website, email,
  is_verified, average_rating, review_count, listing_status, owner_id
) VALUES (
  'Blavity.org',
  'Blavity.org',
  'Blavity.org is a nonprofit that empowers Black entrepreneurs to create generational wealth through education, storytelling, and Black Gravity. It increases access to funding, tools, technology, mentorship, and operational development through fellowships, grants, and training programs.',
  'Nonprofit',
  'Los Angeles',
  'CA',
  'https://www.blavity.org',
  'hello@blavity.org',
  true,
  4.8,
  0,
  'live',
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;