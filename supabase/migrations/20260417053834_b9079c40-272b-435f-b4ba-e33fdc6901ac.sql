ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET banner_url = 'https://mansamusamarketplace.com/images/featured/heritage-banner.jpg',
    logo_url = 'https://mansamusamarketplace.com/images/featured/heritage-banner.jpg'
WHERE id = '43d56453-75d7-4915-94e9-3dc619bbff8f';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;