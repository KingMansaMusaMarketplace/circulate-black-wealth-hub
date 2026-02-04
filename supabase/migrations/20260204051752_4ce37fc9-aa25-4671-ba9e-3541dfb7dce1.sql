-- Update Liberty Bank & Trust with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/liberty-bank-trust-card.jpg',
  banner_url = '/businesses/liberty-bank-trust-card.jpg',
  updated_at = now()
WHERE id = '2102731b-e5cb-4504-8ed2-4d2b5b2a9da1';