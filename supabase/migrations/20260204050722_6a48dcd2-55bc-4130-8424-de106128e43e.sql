-- Update Slutty Vegan with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/slutty-vegan-card.jpg',
  banner_url = '/businesses/slutty-vegan-card.jpg',
  updated_at = now()
WHERE id = 'd877b403-b582-48ec-95ff-e05c6da9123b';