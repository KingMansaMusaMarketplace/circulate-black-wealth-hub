ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET phone = '(210) 552-1368',
    email = 'orbsspin360@gmail.com',
    website = 'https://orbsspincam.com'
WHERE id = 'bb817450-6d26-4ff0-99c8-3b68e502f0e1';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;