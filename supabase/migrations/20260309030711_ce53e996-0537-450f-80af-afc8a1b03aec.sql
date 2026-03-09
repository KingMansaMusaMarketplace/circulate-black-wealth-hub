-- Update Garrett Popcorn Shops with real branding
UPDATE public.businesses
SET 
  banner_url = 'https://www.garrettpopcorn.com/on/demandware.static/-/Sites-garrett-Library/default/dwcfd8c29e/homepage/hero/desktop/garrett-popcorn-hero-desktop.jpg',
  logo_url = 'https://www.garrettpopcorn.com/on/demandware.static/Sites-garrett-Site/-/default/images/garrett-logo.svg'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-300000000003';

-- Update I-57 Rib House with real storefront hero image
UPDATE public.businesses
SET 
  banner_url = 'https://images.squarespace-cdn.com/content/v1/5be0f25b1aef1d802ce0f176/1543288739989-44L9YTO208JTTCYAOHMY/i57-rib-house-best-top-bbq-south-side-chicago-carry-out-strategy-driven-marketing-restaurant.jpg?format=1500w',
  logo_url = 'https://images.squarespace-cdn.com/content/v1/5be0f25b1aef1d802ce0f176/1543288739989-44L9YTO208JTTCYAOHMY/i57-rib-house-best-top-bbq-south-side-chicago-carry-out-strategy-driven-marketing-restaurant.jpg?format=500w'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-300000000004';

-- Update Bamboo Walk with real branding from bamboowalk.com
UPDATE public.businesses
SET 
  banner_url = 'https://static-content.owner.com/funnel/images/1507e061-19bc-4d46-b2c9-1a19214b73b7?v=2155756336',
  logo_url = 'https://bamboowalk.com/pluto-images/funnel/images/1507e061-19bc-4d46-b2c9-1a19214b73b7?h=56&fit=cover'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-200000000004';