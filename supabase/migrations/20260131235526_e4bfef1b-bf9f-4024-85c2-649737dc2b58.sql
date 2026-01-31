-- Update Mansa Musa Demo Restaurant with soul food image
UPDATE public.businesses
SET 
  logo_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
  banner_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop',
  updated_at = now()
WHERE id = '56c2ad1b-9f8c-444d-8027-82b0aa24257e';