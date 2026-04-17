ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET average_rating = 5.0,
    review_count = 1102
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-300000000001';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;