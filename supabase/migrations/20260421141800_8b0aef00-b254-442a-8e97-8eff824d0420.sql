-- GTA Accounting Group: phone from website
UPDATE public.businesses
SET phone = '1-800-993-0633',
    updated_at = now()
WHERE id = '064e1f8a-a69b-49ed-856e-958f7076c369';

-- Essential Accounting Consultants (Cleveland, OH)
UPDATE public.businesses
SET address = NULL,
    zip_code = NULL,
    phone = '216-202-4194',
    email = 'info@essentialacctg.com',
    updated_at = now()
WHERE id = '8195274c-98f9-492f-a2f7-013dae547d79';

-- Kingdom Accounting (Columbus, OH) - phone only
UPDATE public.businesses
SET phone = '614-432-0968',
    email = 'info@kingdomaccountingclbs.com',
    updated_at = now()
WHERE id = '2f4eed13-6bbd-4dee-bce1-623a390e4812';

-- Parnell Accounting Solutions, LLC (verified)
UPDATE public.businesses
SET address = '11220 West Burleigh Street (Inside Expansive)',
    city = 'Wauwatosa',
    state = 'WI',
    zip_code = '53222',
    phone = '(262) 264-8944',
    email = 'latanza.parnell@parnellaccountingsolutions.com',
    updated_at = now()
WHERE id IN ('9eeda812-ad1a-404b-9111-eda0125ca625', 'e33fd825-6c1b-4e1a-a15c-a6261f2e5d57', '2512ccdd-a728-46c4-8fe4-696b9a6c7559');

-- Preston Smith CPA, PLLC (Tulsa, OK)
UPDATE public.businesses
SET address = '8118 East 63rd Street',
    city = 'Tulsa',
    state = 'OK',
    zip_code = '74133',
    phone = '918-250-1040',
    updated_at = now()
WHERE id = 'fc0452ff-309c-49ca-a5bd-1752b55d791f';

-- Black and Gill LLP (Toronto)
UPDATE public.businesses
SET address = '60 Torlake Cres.',
    city = 'Toronto',
    state = 'ON',
    zip_code = 'M8Z 1C2',
    phone = '416-477-7681',
    email = 'info@bgllp.ca',
    updated_at = now()
WHERE id = '6eb75283-bfd8-4726-9ba0-1417636e0137';