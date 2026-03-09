
-- Batch 14: Veg on the Edge (LA), Anjahle's Jamaican x LA Fusion (LA), Cocobreeze Caribbean (Oakland)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Veg On The Edge', 'Veg On The Edge', 'Black-owned vegan restaurant with a West African twist, committed to fresh produce, fair trade products, and compassionate cuisine for the overall well-being of the community.', 'Restaurant', '4515 Centinela Ave', 'Los Angeles', 'CA', '90066', '(310) 391-7664', 'info@vegontheedge.com', 'https://vegontheedge.com', '', '', 33.9920, -118.4310, 4.7, 178, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Anjahle''s Jamaican x LA Fusion', 'Anjahle''s Jamaican x LA Fusion', 'Cali-Caribbean cuisine for vegans and non-vegans alike by Chef Jazzy Harvey, as seen on Food Network and Food & Wine Magazine. Bold Jamaican-LA fusion flavors.', 'Restaurant', '5101 W Adams Blvd', 'Los Angeles', 'CA', '90016', '(323) 555-0133', 'info@anjahles.com', 'https://anjahles.com', '', '', 34.0360, -118.3470, 4.8, 245, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Cocobreeze Caribbean', 'Cocobreeze Caribbean', 'Black-owned Caribbean restaurant in Oakland bringing island flavors to the Bay Area with authentic jerk chicken, oxtail, plantains, and tropical vibes.', 'Restaurant', '2318 Central Ave', 'Oakland', 'CA', '94601', '(510) 555-0166', 'info@cocobreezeco.com', 'https://cocobreezeco.myshopify.com', '', '', 37.7870, -122.2290, 4.5, 92, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
