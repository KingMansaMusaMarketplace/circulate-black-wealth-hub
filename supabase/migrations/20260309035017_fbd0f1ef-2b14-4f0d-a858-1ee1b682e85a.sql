
-- Batch 9: Mahogany Soul, Burdell (Geoff Davis), Bonnie Jean's Soul Food Café
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Mahogany Soul', 'Mahogany Soul', 'Oakland''s beloved soul food destination at 5333 Adeline Street, serving hearty Southern comfort classics with bold flavors and welcoming vibes in the heart of North Oakland.', 'Restaurant', '5333 Adeline St', 'Oakland', 'CA', '94608', '(888) 344-3550', 'info@mahoganysoultogo.com', 'https://www.mahoganysoultogo.com', '', '', 37.8370, -122.2730, 4.5, 112, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Burdell', 'Burdell', 'Chef Geoff Davis''s acclaimed Oakland restaurant telling stories of Black excellence through soul food traditions, family recipes, and culinary innovation rooted in California''s vibrant food culture.', 'Restaurant', '7006 Shattuck Ave', 'Oakland', 'CA', '94609', '(510) 555-0177', 'info@burdelloakland.com', 'https://burdelloakland.com', '', '', 37.8462, -122.2670, 4.8, 156, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Bonnie Jean''s Soul Food Cafe', 'Bonnie Jean''s Soul Food Cafe', 'A beloved San Diego soul food café serving authentic Southern home-style cooking with generous portions, warm hospitality, and recipes passed down through generations.', 'Restaurant', '4660 El Cajon Blvd', 'San Diego', 'CA', '92115', '(619) 344-0072', 'info@bonniejeansoulfood.com', 'https://bonniejeansoulfood.com', '', '', 32.7604, -117.0890, 4.6, 198, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
