-- Jimerson Advisory Group
UPDATE public.businesses
SET address = '19747 US 59 N, Suite 350',
    city = 'Humble',
    state = 'TX',
    zip_code = '77338',
    phone = '(346) 206-2957',
    updated_at = now()
WHERE id = 'b9001fa9-262b-4ce0-b784-f7419eac99d4';

-- Michael W. Rose, CPA, PC
UPDATE public.businesses
SET address = '614 Texas Parkway',
    city = 'Missouri City',
    state = 'TX',
    zip_code = '77489',
    phone = '281-403-0730',
    updated_at = now()
WHERE id = 'c9f8e563-8d2f-4c24-840a-02a883532963';

-- Accounting of the Palm Beaches (clean up "Unknown" fields)
UPDATE public.businesses
SET address = 'West Palm Beach',
    zip_code = '33417',
    updated_at = now()
WHERE id = '6d310257-4cdc-41d6-b4da-e71a76dfc2ce';