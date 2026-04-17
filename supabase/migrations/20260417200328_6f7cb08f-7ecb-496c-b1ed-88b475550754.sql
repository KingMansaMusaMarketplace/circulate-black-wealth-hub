-- Fix Halifax, Nova Scotia coordinates (currently pointing to US locations)
UPDATE public.businesses
SET latitude = 44.6488, longitude = -63.5752, updated_at = now()
WHERE id = '901f1231-100a-498b-b54e-56fb17386420'; -- The Halifax Helpers

UPDATE public.businesses
SET latitude = 44.6745, longitude = -63.6553, updated_at = now()
WHERE id = '8b04553c-cf0d-42be-893d-ed0260b771af'; -- MaidPro Halifax (Kearney Lake Rd)

UPDATE public.businesses
SET latitude = 44.6488, longitude = -63.5752, updated_at = now()
WHERE id = '29b6dc48-5c05-49fb-a612-1a3c25e34dd5'; -- The Black Market Halifax