
-- Insert 3 new Black-owned California restaurants

INSERT INTO public.businesses (
  id, business_name, name, description, category, address, city, state, zip_code,
  phone, email, website, logo_url, banner_url, is_verified, owner_id,
  latitude, longitude, average_rating, review_count
) VALUES
-- 1. Burdell (Oakland) - Food & Wine's Best Restaurant in America 2025, Michelin Guide
(
  gen_random_uuid(),
  'Burdell',
  'Burdell',
  'A nostalgic soul food restaurant in Oakland''s Temescal neighborhood from James Beard Finalist Chef Geoff Davis. Named for his grandmother, Burdell celebrates Black farming, ranching, and culture through seasonal California soul food. Food & Wine''s Best Restaurant in America.',
  'Restaurant',
  '4640 Telegraph Ave',
  'Oakland',
  'CA',
  '94609',
  '(510) 858-5015',
  'info@burdelloakland.com',
  'https://www.burdelloakland.com',
  'https://static.wixstatic.com/media/6211d7_66e18e37edb94f3c84654c7966a49219~mv2.jpg/v1/fill/w_281,h_394,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6211d7_66e18e37edb94f3c84654c7966a49219~mv2.jpg',
  'https://static.wixstatic.com/media/6211d7_66e18e37edb94f3c84654c7966a49219~mv2.jpg/v1/fill/w_281,h_394,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6211d7_66e18e37edb94f3c84654c7966a49219~mv2.jpg',
  true,
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  37.8360,
  -122.2614,
  4.5,
  229
),
-- 2. Dulan's On Crenshaw (Los Angeles) - LA Times 2025 Gold Award, 50+ years of soul food
(
  gen_random_uuid(),
  'Dulan''s On Crenshaw',
  'Dulan''s On Crenshaw',
  'A legendary Los Angeles soul food institution serving Southern home cooking for over 50 years. Winner of the LA Times 2025 Gold Award, Dulan''s offers generations of family recipes including fried chicken, oxtails, mac and cheese, and more. Full-service restaurant, banquet hall, and catering.',
  'Restaurant',
  '4859 Crenshaw Blvd',
  'Los Angeles',
  'CA',
  '90043',
  '(323) 296-3034',
  'info@dulansoulfood.com',
  'https://dulansoulfood.com',
  'https://static.spotapps.co/spots/25/db42c732884cd3aff76ea7a733e17f/w926',
  'https://static.spotapps.co/spots/a6/1b95630acb48dcbea3d93618eb0cfc/w926',
  true,
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  33.9938,
  -118.3305,
  4.7,
  531
),
-- 3. Tev's & Family Kitchen (Los Angeles) - Jamaican soul food sensation, Eater LA featured
(
  gen_random_uuid(),
  'Tev''s & Family Kitchen',
  'Tev''s & Family Kitchen',
  'A buzzing Black-owned Jamaican soul food spot in South LA''s Vermont Square where locals wait up to an hour for authentic Caribbean dishes. Featured by Eater LA, Tev''s serves a rotating menu of jerk chicken, curry chicken, sweet chili wings, oxtails, and more with bold island flavors.',
  'Restaurant',
  '1905 W 48th St',
  'Los Angeles',
  'CA',
  '90062',
  '(323) 685-0243',
  '',
  'https://tevs-family-kitchen.bartgrocerybbq.com',
  'https://cdn6.localdatacdn.com/images/4915448/d_soul_kuisine_cafe_photo.jpg',
  'https://cdn6.localdatacdn.com/images/4915448/d_soul_kuisine_cafe_photo.jpg',
  true,
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  33.9947,
  -118.3097,
  4.4,
  295
);
