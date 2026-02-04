-- Update CZL P.C. with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/czl-pc-card.jpg',
  banner_url = '/businesses/czl-pc-card.jpg',
  updated_at = now()
WHERE id = '634fdcc3-3e20-4b1a-b1e5-c4a2d8001a53';