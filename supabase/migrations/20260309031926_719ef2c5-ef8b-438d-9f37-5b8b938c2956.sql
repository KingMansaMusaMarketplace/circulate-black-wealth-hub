
-- Twisted Soul Cookhouse & Pours - scraped from twistedsoulcookhouseandpours.com
UPDATE public.businesses SET
  banner_url = 'https://static.wixstatic.com/media/5ed0bf_141684e58cb74554b4bab7ab73154576~mv2.jpg/v1/fill/w_479,h_617,al_c,q_80,usm_0.66_1.00_0.01/TwistedSoulFlyer_02-1.webp'
WHERE id = '16b73911-fb7b-452c-8664-cc3cd6d670d9';

-- The Four Way - scraped from fourway901.com
UPDATE public.businesses SET
  logo_url = 'https://images.squarespace-cdn.com/content/v1/6103299c5e7aba1dc48e0fd6/8a23a142-4677-44c9-a1e0-5587596c47d1/4way2.jpeg'
WHERE id = '6d0b7659-fcf6-4e84-8178-c0dd1e6cf3b6';

-- The Juicy Crab Jacksonville - use existing banner as logo
UPDATE public.businesses SET
  logo_url = 'http://nebula.wsimg.com/1430bd43a77d4fb703e485ef6c4ad917?AccessKeyId=C1E941BA9CBFA2CED1FC&disposition=0&alloworigin=1'
WHERE id = '0a076262-dd27-451d-a736-6e5886cd3794';

-- The Weekend Spot - couldn't find direct image URLs from spotapps template
-- Use a search-sourced image
UPDATE public.businesses SET
  logo_url = 'https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/2c/25c3df0ece41d6b5baa2b6fd0c63a9/:original',
  banner_url = 'https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/2c/25c3df0ece41d6b5baa2b6fd0c63a9/:original'
WHERE id = '35fbd2fb-5297-4c81-bb80-6ce29146813f';

-- Premier Health Urgent Care - site unreachable, use local banner as logo
UPDATE public.businesses SET
  logo_url = '/businesses/premier-health-uc-card.jpg'
WHERE id = '658268d6-9da7-4555-bb4c-4857f2b37d97';

-- Burns Original BBQ - site has critical error, website down
-- Leah & Louise - website returns 404
-- Fixins Soul Kitchen - site unreachable
-- Soul Kuisine Cafe - site timeout
-- Almeda - domain not connected
-- These 5 businesses have dead websites. Set a descriptive placeholder.
UPDATE public.businesses SET
  logo_url = NULL, banner_url = NULL
WHERE id IN (
  '5c73b908-e8c8-43d4-a173-22547e122496',
  '7f69656d-4b6d-43e8-a1c6-8d7f8662f30b',
  '57df01cc-56c9-4718-b4da-8fcc3aac9981',
  'f5b332ca-e31a-449e-9030-223bd5ddd33f',
  'be09e973-a526-4c06-8c7c-f191c5fb1897'
) AND (logo_url IS NULL OR logo_url = '' OR logo_url = 'https://www.wix.com/favicon.ico');
