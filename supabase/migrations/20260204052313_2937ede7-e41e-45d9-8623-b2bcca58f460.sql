-- Update Miles College with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/miles-college-card.jpg',
  banner_url = '/businesses/miles-college-card.jpg',
  updated_at = now()
WHERE id = 'b3d42f27-e0d0-4975-b253-bce409e1e67f';