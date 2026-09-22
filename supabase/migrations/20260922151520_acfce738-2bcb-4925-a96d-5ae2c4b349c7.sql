ALTER TABLE public.businesses DISABLE TRIGGER USER;

UPDATE public.businesses
SET is_verified = false,
    is_founding_sponsor = false,
    founding_sponsor_since = NULL,
    listing_status = 'rejected'
WHERE id = '40e784fa-43b1-4b08-800e-2856374dfd13';

ALTER TABLE public.businesses ENABLE TRIGGER USER;