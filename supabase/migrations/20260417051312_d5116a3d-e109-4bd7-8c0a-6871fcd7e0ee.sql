
ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

INSERT INTO public.businesses (
  owner_id, business_name, name, description, category,
  city, state, website, email, logo_url,
  is_verified, is_founding_sponsor, founding_sponsor_since,
  listing_status, subscription_status, average_rating, review_count
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'MaC Venture Capital',
  'MaC Venture Capital',
  'MaC Venture Capital is a seed-stage venture capital firm investing in technology startups that benefit from shifts in cultural trends and behaviors of tomorrow''s mainstream. Founded by Marlon Nichols, Michael Palank, Adrian Fenty, and Charles King, MaC partners with visionary founders across consumer, enterprise, and frontier technology.',
  'Venture Capital',
  'Los Angeles', 'CA',
  'https://macventurecapital.com',
  'info@macventurecapital.com',
  'https://macventurecapital.com/wp-content/uploads/2021/02/mac-logo.svg',
  true, true, now(),
  'live', 'active', 4.9, 0
);

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;
