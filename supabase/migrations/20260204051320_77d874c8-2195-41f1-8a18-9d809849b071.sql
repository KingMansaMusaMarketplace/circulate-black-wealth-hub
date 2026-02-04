-- Update Carver Federal Savings Bank with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/carver-bank-card.jpg',
  banner_url = '/businesses/carver-bank-card.jpg',
  updated_at = now()
WHERE id = 'f090f21c-0228-4111-b026-f1d3f5dfc73e';