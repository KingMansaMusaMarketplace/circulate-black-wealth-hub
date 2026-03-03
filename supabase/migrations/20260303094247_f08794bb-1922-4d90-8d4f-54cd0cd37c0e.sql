
-- Disable just the problematic trigger
ALTER TABLE public.businesses DISABLE TRIGGER trigger_new_business_slack_notification;

-- Insert Victor's Seafood & Steak
INSERT INTO public.businesses (
  id, name, business_name, description, category,
  address, city, state, zip_code, phone, email, website,
  logo_url, banner_url, latitude, longitude,
  is_verified, listing_status, owner_id,
  created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Victor''s Seafood & Steak',
  'Victor''s Seafood & Steak',
  'Elegant seafood and steakhouse featuring shareable appetizers, classic steakhouse entrees, local seafood specialties, signature cocktails, and barrel-aged drinks in a refined dining room with plush booths and gallery-style artwork.',
  'Restaurants',
  '39F John St',
  'Charleston',
  'SC',
  '29403',
  '(843) 203-3000',
  'info@holycityhospitality.com',
  'https://www.holycityhospitality.com/victors-seafood-and-steak/',
  '/images/businesses/victors-seafood-logo.svg',
  '/images/businesses/victors-seafood-banner.jpg',
  32.7876,
  -79.9371,
  true,
  'live',
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  now(),
  now()
);

-- Re-enable the trigger
ALTER TABLE public.businesses ENABLE TRIGGER trigger_new_business_slack_notification;
