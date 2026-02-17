
-- Fix HEALing Community Health banner to actual hero image
UPDATE public.businesses
SET 
  banner_url = 'https://healatlanta.org/wp-content/uploads/2022/12/Black-Doctor-checking-on-little-boy.jpg',
  updated_at = now()
WHERE name = 'HEALing Community Health';
