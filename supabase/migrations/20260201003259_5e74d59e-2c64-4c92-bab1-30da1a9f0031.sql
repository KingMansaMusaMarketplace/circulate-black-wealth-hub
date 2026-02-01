-- Update OneUnited Bank with proper banner image
UPDATE public.businesses
SET 
  logo_url = '/businesses/oneunited-bank.webp',
  banner_url = '/businesses/oneunited-bank.webp',
  updated_at = now()
WHERE id = '1ab54e23-df01-45bf-8f52-0165b142b755';