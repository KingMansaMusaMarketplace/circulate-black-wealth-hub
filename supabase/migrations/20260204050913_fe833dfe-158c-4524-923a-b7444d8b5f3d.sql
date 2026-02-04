-- Update Citizens Trust Bank with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/citizens-trust-bank-card.jpg',
  banner_url = '/businesses/citizens-trust-bank-card.jpg',
  updated_at = now()
WHERE id = 'b3454666-ff6a-41e1-97e7-92a06b69ec9f';