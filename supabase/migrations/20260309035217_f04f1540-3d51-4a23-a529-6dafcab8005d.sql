
-- Batch 11: Dee Dee's Soul Food (San Diego), Bludso's BBQ (LA), Delicious at the Dunbar (LA)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Dee Dee''s Soul Food', 'Dee Dee''s Soul Food', 'Chef Dee Dee''s beloved San Diego soul food spot specializing in classic fried chicken, smothered pork chops, collard greens, mac n cheese, catfish, and signature seafood boils.', 'Restaurant', '5745 University Ave', 'San Diego', 'CA', '92105', '(619) 788-9917', 'info@deedeessoulfood.com', 'https://www.deedeessoulfood.com', '', '', 32.7498, -117.0810, 4.5, 167, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Bludso''s BBQ', 'Bludso''s BBQ', 'Kevin Bludso''s legendary Texas-style BBQ in Los Angeles, famous for incredible dinosaur beef ribs, brisket, and authentic pit-smoked meats that have earned a devoted following.', 'Restaurant', '609 N La Brea Ave', 'Los Angeles', 'CA', '90036', '(323) 931-2583', 'info@bludsos.com', 'https://bludsos.com', '', '', 34.0838, -118.3445, 4.8, 520, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Delicious at the Dunbar', 'Delicious at the Dunbar', 'A vibrant Los Angeles eatery located in the historic Dunbar Hotel building on Central Avenue, celebrating Black culinary heritage with soulful comfort food and community spirit.', 'Restaurant', '4225 S Central Ave', 'Los Angeles', 'CA', '90011', '(323) 233-7168', 'info@deliciousatthedunbar.com', 'https://deliciousatthedunbar.com', '', '', 33.9960, -118.2568, 4.4, 132, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
