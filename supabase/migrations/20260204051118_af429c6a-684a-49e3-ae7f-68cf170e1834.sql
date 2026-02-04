-- Update Black Digital with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/black-digital-card.jpg',
  banner_url = '/businesses/black-digital-card.jpg',
  updated_at = now()
WHERE id = 'a560a8a8-7a14-44ee-b0dc-a1b13417c191';