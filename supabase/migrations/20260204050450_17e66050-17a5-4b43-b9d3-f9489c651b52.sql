-- Update City First Bank with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/city-first-bank-card.jpg',
  banner_url = '/businesses/city-first-bank-card.jpg',
  updated_at = now()
WHERE id = '94cb662d-ff2f-4893-9e34-047b2aa3ecb8';