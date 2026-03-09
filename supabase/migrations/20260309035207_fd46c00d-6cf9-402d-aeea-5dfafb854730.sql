
-- Batch 10: Billionaire Burger Boyz (Compton), Trap Kitchen (Compton), Alma's Place (Compton)
INSERT INTO public.businesses (id, business_name, name, description, category, address, city, state, zip_code, phone, email, website, logo_url, banner_url, latitude, longitude, average_rating, review_count, is_verified, owner_id)
VALUES
(gen_random_uuid(), 'Billionaire Burger Boyz', 'Billionaire Burger Boyz', 'Compton-born burger phenomenon founded by Derrick Bivens, turning a food truck passion into a full restaurant with over-the-top gourmet burgers and bold flavors.', 'Restaurant', '501 W Compton Blvd', 'Compton', 'CA', '90220', '(310) 555-0210', 'info@billionaireburgerboyz.com', 'https://billionaireburgerboyz.com', '', '', 33.8958, -118.2253, 4.7, 340, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'Trap Kitchen', 'Trap Kitchen', 'Founded by former rivals Malachi "Spank" Jenkins and Roberto "News" Smith in Compton, Trap Kitchen proves great food unites communities. Famous for Pineapple Bowls and succulent oxtails.', 'Restaurant', '4007 W Washington Blvd', 'Los Angeles', 'CA', '90018', '(323) 505-5765', 'info@thetrapkitchen.com', 'https://thetrapkitchen.com', '', '', 34.0357, -118.3170, 4.6, 275, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b'),

(gen_random_uuid(), 'The Caribe SD', 'The Caribe SD', 'Afro-Caribbean and Latin fusion restaurant in Bonita, San Diego, serving authentic dishes from Jamaica, Nigeria, Puerto Rico, Dominican Republic, and Colombia including signature Mofongo Royale.', 'Restaurant', '4206 Bonita Rd', 'Bonita', 'CA', '91902', '(619) 600-0568', 'info@thecaribesd.com', 'https://thecaribesd.com', '', '', 32.6580, -117.0320, 4.8, 189, true, 'bd72a75e-1310-4f40-9c74-380443b09d9b');
