ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET address = '731 W. Anaheim Street',
    city = 'Long Beach',
    state = 'CA',
    zip_code = '90813',
    phone = '(562) 432-1133',
    latitude = NULL,
    longitude = NULL
WHERE id = '95f4e446-66a2-4c1e-bd69-57341dbebc4b';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;