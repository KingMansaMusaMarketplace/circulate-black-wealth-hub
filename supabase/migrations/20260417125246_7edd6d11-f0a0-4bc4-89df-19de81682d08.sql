ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET address = 'G-3098 N. Center Road',
    city = 'Flint',
    state = 'MI',
    zip_code = '48506',
    phone = '810-243-4449',
    email = COALESCE(email, 'info@insideacceleration.com'),
    latitude = NULL,
    longitude = NULL
WHERE id = '59afe4da-424f-4273-aab0-54590bb6d794';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;