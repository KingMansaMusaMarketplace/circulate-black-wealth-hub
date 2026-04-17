ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET address = '1220 Executive Blvd. Suite 109',
    city = 'Chesapeake',
    state = 'VA',
    zip_code = '23320',
    phone = '757-436-2722',
    latitude = NULL,
    longitude = NULL
WHERE id = 'a685a90b-4078-480a-a392-e384c1dbab19';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;