ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET average_rating = 4.8,
    review_count = 804,
    is_verified = true,
    is_founding_sponsor = true,
    subscription_status = 'active',
    listing_status = 'live'
WHERE id = 'b09811d2-336f-4a99-a73f-4d2d4e2cd4f1';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;