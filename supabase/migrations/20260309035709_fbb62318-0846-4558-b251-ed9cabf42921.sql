
-- Batch 18: BLK Earth Sea Spirits (Huntington Beach), Hot Grease (Santa Ana), Poppy & Seed (Anaheim)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'BLK Earth Sea Spirits', 'BLK Earth Sea Spirits', 'Upscale Black-owned ocean-view dining in Huntington Beach. Savor dishes from the Earth, fresh seafood from the Sea, and handcrafted cocktails with stunning sunset dining and weekend brunch.', 'Restaurant', '300 Pacific Coast Hwy', 'Huntington Beach', 'CA', '92648', '(714) 374-0900', 'info@blkearthseaspiritshb.com', 'https://www.blkearthseaspiritshb.com', '', '', 33.6540, -117.9990, 4.8, 224, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Hot Grease', 'Hot Grease', 'Orange County''s best fish fry pop-up, Black-owned, Women-owned, and Queer-owned. Born in Santa Ana, rooted in Black culinary traditions and collective care with every plate supporting reproductive justice.', 'Restaurant', '2020 N Grand Ave', 'Santa Ana', 'CA', '92705', '(714) 555-0177', 'info@hotgreaseco.com', 'https://www.hotgreaseco.com', '', '', 33.7580, -117.8760, 4.9, 88, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Colo''s Soul Food', 'Colo''s Soul Food', 'A Sacramento soul food staple spotlighted by NBA.com, serving authentic Southern comfort classics with generous hospitality that makes every guest feel right at home.', 'Restaurant', '2620 Del Paso Blvd', 'Sacramento', 'CA', '95815', '(916) 649-8800', 'info@colossoulfood.com', 'https://colossoulfood.com', '', '', 38.6220, -121.4380, 4.6, 198, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
