UPDATE public.businesses
SET website = 'https://amezion.org/location/new-bethel',
    email = 'newbethelamezbusiness@gmail.com',
    updated_at = now()
WHERE name = 'New Bethel A.M.E. Zion Church'
  AND city = 'Fayetteville';