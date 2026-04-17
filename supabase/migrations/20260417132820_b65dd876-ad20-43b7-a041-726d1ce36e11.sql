ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET address = '3737 Government Blvd Ste 404',
    city = 'Mobile',
    state = 'AL',
    zip_code = '36693',
    phone = '+1 (251) 236-7306',
    latitude = NULL,
    longitude = NULL
WHERE id = '11f421ab-1678-4f99-a5c2-7db5b244fbb3';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;