ALTER TABLE public.businesses DISABLE TRIGGER trg_business_embedding_update;

UPDATE public.businesses
SET logo_url = 'https://macventurecapital.com/wp-content/themes/mac-venture-capital/images/logo.svg',
    banner_url = 'https://mansamusamarketplace.com/images/featured/mac-venture-banner.jpg'
WHERE id = '51832a8d-b63a-4910-b64c-77579d9bcb69';

ALTER TABLE public.businesses ENABLE TRIGGER trg_business_embedding_update;