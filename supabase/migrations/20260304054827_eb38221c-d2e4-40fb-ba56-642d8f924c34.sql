
-- Fix: Blessings has no street address on their website, clear the bad value
UPDATE public.businesses
SET address = ''
WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a' AND address = '872 N/A';
