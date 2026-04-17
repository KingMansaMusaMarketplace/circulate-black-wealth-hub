ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET phone = '(306) 531-9525',
    email = 'learningcreativelyyqr@gmail.com',
    latitude = NULL,
    longitude = NULL
WHERE id = '0ed1287e-64a9-4ac5-bc1d-066169b904cb';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;