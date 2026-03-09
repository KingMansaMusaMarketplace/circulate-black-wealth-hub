
-- Batch 21: Q1227 Chef Q (Roseville), Jikoni AfriCali (LA), CakesAndCurls (Inglewood)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Q1227', 'Q1227', 'Top-rated Black-owned restaurant in California by Chef Quentin Bennett. Featured on talk shows, cooking for the stars. Upscale dining at Westfield Galleria in Roseville with celebrity chef experience.', 'Restaurant', '1151 Galleria Blvd', 'Roseville', 'CA', '95678', '(916) 780-1227', 'info@q1227.com', 'https://q1227.com', '', '', 38.7740, -121.2640, 4.9, 387, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Jikoni', 'Jikoni', 'AfriCali dining concept by Chef Kiano Moju. Kenyan/Nigerian heritage reimagined through California lens - small chops, choma grilled plates, and craveable desserts popping up across Los Angeles.', 'Restaurant', '751 N Virgil Ave', 'Los Angeles', 'CA', '90029', '(323) 555-0188', 'info@jikoni.co', 'https://jikoni.co', '', '', 34.0890, -118.2870, 4.8, 76, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'CakesAndCurls', 'CakesAndCurls', 'Premier bakery and catering in Inglewood where quality comes first. Custom one-of-a-kind designs, homemade with love using the best ingredients. A one-stop shop for every occasion.', 'Restaurant', '315 N Market St', 'Inglewood', 'CA', '90302', '(310) 555-0144', 'info@cakesandcurls.com', 'https://cakesandcurls.com', '', '', 33.9630, -118.3530, 4.8, 198, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
