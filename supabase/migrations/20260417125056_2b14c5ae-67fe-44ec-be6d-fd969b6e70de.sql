ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET email = 'yasmeena@hirezouita.com',
    city = 'Florence',
    logo_url = NULL,
    banner_url = NULL
WHERE id = '5ea776a5-7f88-44ae-affb-ce4ea48202d4';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;