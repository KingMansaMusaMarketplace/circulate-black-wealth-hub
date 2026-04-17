ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

INSERT INTO public.businesses (
  name, business_name, description, category, city, state, website, email,
  is_verified, average_rating, review_count, listing_status, owner_id
) VALUES (
  'AfroTech',
  'AfroTech',
  'AfroTech is the largest multicultural tech conference and digital media platform empowering Black innovators, technologists, founders, and creators. Through events, content, and programs like Future 50 and AfroTech U, the company connects talent with opportunity across the tech ecosystem.',
  'Technology',
  'Oakland',
  'CA',
  'https://afrotech.com',
  'partner@afrotech.com',
  true,
  4.8,
  0,
  'live',
  'bd72a75e-1310-4f40-9c74-380443b09d9b'
);

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;