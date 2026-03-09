
-- Batch 20: M'Dears Bakery & Bistro, Vera Mae's BBQ, Blacos Soul Tacos
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'M''Dears Bakery & Bistro', 'M''Dears Bakery & Bistro', 'Elegant Southern cuisine with a California twist. Where Southern hospitality is alive, Doo Wop plays, and traditional soul food and Creole dishes are elegantly presented with contemporary flair.', 'Restaurant', '3622 Martin Luther King Jr Blvd', 'Los Angeles', 'CA', '90008', '(323) 291-5856', 'info@mdears.net', 'https://www.mdears.net', '', '', 34.0070, -118.3330, 4.7, 234, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Vera Mae''s BBQ', 'Vera Mae''s BBQ', 'Family-owned food truck rooted in tradition, bringing Southern soul to the streets of SoCal. Slow-smoked flavor, bold seasoning, and family tradition in every bite from Riverside.', 'Restaurant', '3737 Main St', 'Riverside', 'CA', '92501', '(951) 555-0188', 'info@veramaesbbq.com', 'https://veramaesbbq.com', '', '', 33.9830, -117.3750, 4.8, 156, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Blacos Soul Tacos', 'Blacos Soul Tacos', 'Los Angeles food truck merging soul food with tacos. Signature ATLiens savory shrimp tacos, All Eyes On Me smoked BBQ brisket tacos with cheese-encrusted tortillas and signature slaw.', 'Restaurant', 'Mobile - Los Angeles Area', 'Los Angeles', 'CA', '90001', '(323) 555-0199', 'info@blacossoultacos.com', 'https://blacossoultacos.com', '', '', 34.0522, -118.2437, 4.7, 89, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
