UPDATE public.businesses
SET phone = '(313) 685-0024',
    address = '9033 Woodward Ave',
    city = 'Detroit',
    state = 'MI',
    zip_code = '48202',
    website = COALESCE(NULLIF(website, ''), 'https://zarkpas.com')
WHERE id = '0e9b1d27-cc83-4bd1-bbdf-d21af629c237';