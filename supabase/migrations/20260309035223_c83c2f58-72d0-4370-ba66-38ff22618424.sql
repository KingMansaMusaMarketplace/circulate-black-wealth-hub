
-- Batch 12: Doll's Kitchen (Fresno), Triumph African Restaurant (Fresno), Fresno Gumbo House (Fresno)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Doll''s Kitchen', 'Doll''s Kitchen', 'Fresno''s beloved soul food gem on McKinley and Chestnut, earning a loyal following through word-of-mouth for its authentic Southern comfort classics and warm hospitality.', 'Restaurant', '4583 E McKinley Ave', 'Fresno', 'CA', '93703', '(559) 555-0188', 'info@dollskitchen.com', 'https://dollskitchen.com', '', '', 36.7590, -119.7520, 4.6, 95, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Triumph African Restaurant', 'Triumph African Restaurant', 'A culinary celebration of African heritage in Fresno, bringing authentic traditional cuisine with diverse and bold flavors that define the richness of the continent.', 'Restaurant', '3636 N Blackstone Ave', 'Fresno', 'CA', '93726', '(559) 412-4100', 'info@triumphafricanrestaurant.com', 'https://triumphafricanrestaurant.com', '', '', 36.7830, -119.7890, 4.5, 78, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Fresno Gumbo House', 'Fresno Gumbo House', 'Family-friendly Cajun restaurant in downtown Fresno famous for customizable gumbo, flavorful crab boils, and authentic Southern Louisiana cuisine with excellent customer service.', 'Restaurant', '1340 Fresno St #101', 'Fresno', 'CA', '93706', '(559) 270-5536', 'info@fresnogumbohouse.com', 'https://fresnogumbohouse.com', '', '', 36.7370, -119.7940, 4.7, 125, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
