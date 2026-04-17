ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET average_rating = 5.0,
    review_count = 600
WHERE id = '51832a8d-b63a-4910-b64c-77579d9bcb69';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;