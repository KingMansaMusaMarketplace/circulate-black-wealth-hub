ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET city = 'Castries',
    state = 'LC',
    zip_code = 'Not applicable',
    address = 'Online tutoring service',
    latitude = NULL,
    longitude = NULL
WHERE id = '32bf8ad7-e392-4ff3-89b4-f6de8554bc14';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;