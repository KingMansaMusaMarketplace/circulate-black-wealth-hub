ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET address = '1655 Mcfarland Blvd N, Unit 473',
    city = 'Tuscaloosa',
    state = 'AL',
    zip_code = '35406',
    phone = '(662) 549-1426',
    email = 'info@honeyeventsdesign.com',
    latitude = NULL,
    longitude = NULL
WHERE id = '8805069d-914e-4dcb-90dc-d9369d6d6c1e';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;