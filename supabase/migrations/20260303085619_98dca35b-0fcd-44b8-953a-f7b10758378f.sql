
-- Disable just the problematic trigger
ALTER TABLE public.businesses DISABLE TRIGGER trigger_new_business_slack_notification;

INSERT INTO public.businesses (
  owner_id, business_name, name, description, category,
  address, city, state, zip_code, phone, website,
  logo_url, banner_url, latitude, longitude,
  is_verified, listing_status, average_rating, review_count
) VALUES (
  'bd72a75e-1310-4f40-9c74-380443b09d9b',
  'Marathon Burger',
  'Marathon Burger',
  'Gourmet burger restaurant on Melrose Ave in Los Angeles, serving premium smash burgers, fries, and shakes. Available for delivery on DoorDash.',
  'Restaurants',
  '7507 Melrose Ave',
  'Los Angeles',
  'CA',
  '90046',
  '(323) 452-0021',
  'https://www.marathonburger.com',
  '/images/businesses/marathon-burger-logo.jpg',
  '/images/businesses/marathon-burger-banner.jpg',
  34.0837,
  -118.3554,
  true,
  'live',
  4.5,
  0
);

-- Re-enable the trigger
ALTER TABLE public.businesses ENABLE TRIGGER trigger_new_business_slack_notification;
