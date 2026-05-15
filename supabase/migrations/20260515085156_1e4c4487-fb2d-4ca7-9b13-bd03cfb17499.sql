UPDATE public.businesses
SET address = '400 Wabasha Street North, #200',
    city = 'Saint Paul',
    state = 'MN',
    zip_code = '55101',
    phone = '(651) 888-2168',
    website = COALESCE(NULLIF(website, ''), 'https://afrodeli.com'),
    latitude = NULL,
    longitude = NULL
WHERE id = '4a642f60-d85f-4b8d-b488-b10ab3f03da3';