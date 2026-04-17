-- Bypass broken embedding trigger for this update
ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET 
  address = '2820 Fairlane Dr. A3',
  city = 'Montgomery',
  state = 'AL',
  zip_code = '36116',
  phone = '334-802-1315',
  latitude = 32.3340,
  longitude = -86.2261,
  updated_at = now()
WHERE id = 'a277e2af-b682-4687-9d1c-457151b03389';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;