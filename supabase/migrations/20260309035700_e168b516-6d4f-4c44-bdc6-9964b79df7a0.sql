
-- Batch 17: Louisiana Heaven (Sacramento), Noonie's Place (Vallejo), House of Soul (Vallejo)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Louisiana Heaven', 'Louisiana Heaven', 'Sacramento''s best Southern cuisine, bringing Louisiana flavors together through authentic gumbo, jambalaya, fried catfish, and comfort food that brings folks together.', 'Restaurant', '1610 Arden Way', 'Sacramento', 'CA', '95815', '(916) 928-1888', 'info@louisianaheaven.com', 'https://louisianaheaven.com', '', '', 38.6050, -121.4230, 4.6, 178, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Noonie''s Place', 'Noonie''s Place', 'Vallejo''s go-to spot for real soul food on Sonoma Blvd. Serving oxtails, fried catfish, and fresh home-cooked meals that feel like family in a warm, welcoming space.', 'Restaurant', '812 Sonoma Blvd', 'Vallejo', 'CA', '94590', '(707) 555-0166', 'info@nooniesplace.com', 'https://nooniesplace.com', '', '', 38.1040, -122.2600, 4.7, 143, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'House of Soul', 'House of Soul', 'Beloved Vallejo soul food restaurant serving hearty Southern classics Tuesday through Sunday with authentic flavors, generous portions, and a welcoming community atmosphere.', 'Restaurant', '1526 Solano Ave', 'Vallejo', 'CA', '94590', '(707) 644-3792', 'info@houseofsoulvallejo.com', 'https://houseofsoul.top-cafes.com', '', '', 38.0985, -122.2560, 4.5, 97, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
