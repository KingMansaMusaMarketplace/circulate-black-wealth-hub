-- Update The Harbor Bank of Maryland with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/harbor-bank-card.jpg',
  banner_url = '/businesses/harbor-bank-card.jpg',
  updated_at = now()
WHERE id = '951e24f5-4a7a-4b32-87a3-5c02f9c0c9f9';