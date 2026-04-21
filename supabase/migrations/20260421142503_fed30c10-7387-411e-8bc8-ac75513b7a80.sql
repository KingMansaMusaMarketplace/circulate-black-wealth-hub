-- Eclat Enterprises (Butler HQ + Milwaukee remote)
UPDATE public.businesses
SET address = '12714 W. Hampton Ave, Unit F',
    city = 'Butler',
    state = 'WI',
    zip_code = '53007',
    phone = '(414) 375-9600',
    email = 'info@consulteclat.com',
    updated_at = now()
WHERE id = '6292bb86-7369-4d17-8174-01d101c28a56';

-- MJ Ahmed CPA PLLC (Dallas, TX)
UPDATE public.businesses
SET address = '13151 Emily Rd, Suite 200',
    city = 'Dallas',
    state = 'TX',
    zip_code = '75240',
    phone = '(214) 636-8100',
    email = 'mj@dallascpa.net',
    updated_at = now()
WHERE id = '032da1d8-f73f-4654-8c8d-51d47b8e8de0';

-- Red2Black Accounting & Tax, LLC (Sandy, UT)
UPDATE public.businesses
SET address = '8180 S 700 E, Suite 110',
    city = 'Sandy',
    state = 'UT',
    zip_code = '84070',
    updated_at = now()
WHERE id = '137c5118-efb7-4ec1-9bce-967f46957b52';