UPDATE public.businesses
SET address = '200 E M L King Blvd',
    phone = '(423) 266-8658',
    updated_at = now()
WHERE id = '1be2cd69-5f30-4f2f-8b11-5282ec5375a7';

UPDATE public.businesses
SET address = '600 State Drive, Exposition Park',
    zip_code = '90037',
    phone = '(213) 744-7432',
    updated_at = now()
WHERE id = 'ec8e44cc-090f-43a2-8f2a-b0d9c7b5fa18';