ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET zip_code = '32501',
    latitude = NULL,
    longitude = NULL
WHERE id = '6f8f242f-9d79-4359-b42c-6df9068c56a3';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;