-- Update St. Patrick's Rooftop & Steakhouse with proper image
UPDATE public.businesses
SET 
  logo_url = '/businesses/st-patricks-place.jpg',
  banner_url = '/businesses/st-patricks-place.jpg',
  updated_at = now()
WHERE id = '912860a9-1c74-466e-aab2-c42691442d8f';