
-- Fix the trigger function that references non-existent owner_name column
CREATE OR REPLACE FUNCTION public.notify_new_business_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'new_business',
    'data', jsonb_build_object(
      'business_name', NEW.name,
      'category', NEW.category,
      'city', NEW.city,
      'state', NEW.state
    )
  );
  
  PERFORM pg_notify('new_business_signup', payload::text);
  RETURN NEW;
END;
$$;

-- Insert The Beard Bar ATL
INSERT INTO public.businesses (
  id, business_name, name, description, category, address, city, state, zip_code,
  phone, website, is_verified, listing_status,
  owner_id, latitude, longitude, logo_url
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-100000000001',
  'The Beard Bar ATL',
  'The Beard Bar ATL',
  'The Beard Bar is a luxury male grooming salon featuring a top-tier experience and professional services for the well-kept man. Founded by Kenyatta Watson, it offers haircut services, beard & shave services, and specialty grooming in a premium barbershop environment.',
  'Barbershop',
  'Atlanta, GA',
  'Atlanta',
  'GA',
  '30301',
  '',
  'https://www.thebeardbaratl.com',
  true,
  'live',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  33.7490,
  -84.3880,
  'https://static.wixstatic.com/media/ce1a56_54cbe37b6e3d4fccb526ab8dd25cb242~mv2.jpg/v1/fill/w_200,h_200,al_c,q_85/ce1a56_54cbe37b6e3d4fccb526ab8dd25cb242~mv2.jpg'
);

-- Insert Royal Roots Barber Shop
INSERT INTO public.businesses (
  id, business_name, name, description, category, address, city, state, zip_code,
  phone, website, is_verified, listing_status,
  owner_id, latitude, longitude, logo_url
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-100000000002',
  'Royal Roots Barber Shop',
  'Royal Roots Barber Shop',
  'Royal Roots Barbershop has been a vital part of the Atlanta community for over 20 years, offering a blend of cultural significance and skilled grooming services. Specializing in haircuts, shaves, hair maintenance, braiding, loc maintenance, and skin care treatments, they provide a royal touch to every service.',
  'Barbershop',
  '2479 Delowe Drive SW',
  'East Point',
  'GA',
  '30344',
  '(404) 761-6888',
  'https://royalrootsbarbershop.com',
  true,
  'live',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  33.6884,
  -84.4580,
  'https://royalrootsbarbershop.com/logo.png'
);
