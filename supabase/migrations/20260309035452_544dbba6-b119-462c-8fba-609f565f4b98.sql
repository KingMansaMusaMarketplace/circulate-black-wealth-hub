
-- Batch 15: Lucia Afro-Caribbean (LA), Hot & Cool Cafe vegan (LA), Phill's Corner Grill (Clovis/Fresno)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Lucia', 'Lucia', 'Newly opened Afro-Caribbean restaurant in Los Angeles''s Fairfax District, bringing vibrant island-inspired dishes and bold Caribbean flavors to one of LA''s trendiest neighborhoods.', 'Restaurant', '7515 Melrose Ave', 'Los Angeles', 'CA', '90046', '(323) 555-0199', 'info@luciarestaurant.com', 'https://luciarestaurant.com', '', '', 34.0835, -118.3530, 4.7, 67, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Hot & Cool Cafe', 'Hot & Cool Cafe', 'Black-owned vegan cafe in Leimert Park, LA, serving plant-based soul food, smoothies, and community vibes. A cultural cornerstone of the Leimert Park Village arts district.', 'Restaurant', '4331 Degnan Blvd', 'Los Angeles', 'CA', '90008', '(323) 293-3855', 'info@hotandcoolcafe.com', 'https://hotandcoolcafe.com', '', '', 34.0085, -118.3340, 4.6, 198, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Phill''s Corner Grill', 'Phill''s Corner Grill', 'Phillip Young''s beloved BBQ spot in Clovis/Fresno at Peacock Market, smoking authentic meats and serving Central Valley''s best Black-owned barbecue with Southern soul.', 'Restaurant', '4276 N Tollhouse Rd', 'Clovis', 'CA', '93619', '(559) 555-0177', 'info@phillscornergrill.com', 'https://phillscornergrill.com', '', '', 36.8360, -119.6870, 4.7, 110, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
