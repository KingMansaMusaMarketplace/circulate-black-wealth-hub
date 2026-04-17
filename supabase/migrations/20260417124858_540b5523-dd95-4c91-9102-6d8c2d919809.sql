ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET city = 'Port of Spain',
    state = 'TT',
    address = 'Online tutoring service',
    zip_code = 'Not applicable',
    latitude = NULL,
    longitude = NULL
WHERE id = '38fa4cd0-f50e-4cf4-bdbb-3c47d8709ff0';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;