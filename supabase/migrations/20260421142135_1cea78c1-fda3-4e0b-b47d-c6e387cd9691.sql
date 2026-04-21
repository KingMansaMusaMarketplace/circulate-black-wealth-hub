-- CLE Consulting Firm (Cleveland, OH) - correct address
UPDATE public.businesses
SET address = '1001 Lakeside Ave. East, Suite 1520',
    city = 'Cleveland',
    state = 'OH',
    zip_code = '44114',
    phone = '(216) 800-9021',
    email = NULL,
    updated_at = now()
WHERE id = '6f88ec69-91cb-4d79-9802-9e4ba9774ae9';

-- De'Mario Black, CPA (all 3 dupes - Atlanta HQ)
UPDATE public.businesses
SET address = '2727 Paces Ferry Rd SE, Building One, Suite 750',
    city = 'Atlanta',
    state = 'GA',
    zip_code = '30339',
    phone = '(470) 690-5794',
    email = 'dblack@demarioblackcpa.com',
    updated_at = now()
WHERE id IN ('ce66cbd0-1e3c-43a6-b672-9145b508986e', 'db689c60-a052-4be6-95e7-65bcecb7f5fc', '34098a4b-ab85-4298-8e74-300b71be2864');

-- Randle & Associates LLC, CPAs (Black Jack, MO)
UPDATE public.businesses
SET address = '70 Black Jack Ct',
    city = 'Black Jack',
    state = 'MO',
    zip_code = '63033',
    phone = '(314) 731-8085',
    updated_at = now()
WHERE id = '25f9415d-3497-45b5-9fa0-c06bc5cd1e72';

-- A Little Faith Accounting & Tax Services, LLC (Baltimore, MD)
UPDATE public.businesses
SET address = '4324 York Road, Suite 103',
    city = 'Baltimore',
    state = 'MD',
    zip_code = '21212',
    email = NULL,
    phone = NULL,
    updated_at = now()
WHERE id = '91e7ec0a-32f4-4c82-8509-9f3be04d7e4d';