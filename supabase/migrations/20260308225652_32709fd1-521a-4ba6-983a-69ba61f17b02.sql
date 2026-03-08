-- Fix 31 businesses missing zip codes
UPDATE businesses SET zip_code = '36104' WHERE id = '9da5f112-fd8d-4f28-9222-d2b71dd7b260'; -- Alabama State University, Montgomery AL
UPDATE businesses SET zip_code = '30303' WHERE id = 'd5afdc83-55b3-41bc-8b26-3aa1027b5d91'; -- Arthur Wylie, Atlanta GA
UPDATE businesses SET zip_code = '30303' WHERE id = 'efbabe0f-6b46-450e-b363-e017937134af'; -- Big Daddy Garden, Atlanta GA
UPDATE businesses SET zip_code = '20005' WHERE id = 'a560a8a8-7a14-44ee-b0dc-a1b13417c191'; -- Black Digital, Washington DC
UPDATE businesses SET zip_code = '60620' WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a'; -- Blessings Community Care, Chicago IL
UPDATE businesses SET zip_code = '30303' WHERE id = '6fbad717-7b98-40e6-a32a-e390e7afd510'; -- CEO Capital Funding, Atlanta GA
UPDATE businesses SET zip_code = '30058' WHERE id = '80c221f5-b104-4ad1-a50c-94627e88344d'; -- CookWilliams Enterprises, Lithonia GA
UPDATE businesses SET zip_code = '90048' WHERE id = 'f7aa7052-e49b-491e-a4cf-8a071c697baa'; -- Creative Theory Agency, LA CA
UPDATE businesses SET zip_code = '70126' WHERE id = '0610eda7-50be-47e8-a5ad-a1ace8606fae'; -- Deep South Center, New Orleans LA
UPDATE businesses SET zip_code = '14201' WHERE id = 'f3776cb0-6f2c-45bf-95cb-b5b11a095875'; -- Durham Memorial Outreach, Buffalo NY
UPDATE businesses SET zip_code = '30303' WHERE id = '802365c8-928e-41d2-a5a7-3e29e5685e8a'; -- Ebony Twilley-Martin, Atlanta GA
UPDATE businesses SET zip_code = '30303' WHERE id = 'a7f8ccd0-fd8d-476b-b596-f79a87d1cfd7'; -- Fruitee Water, Atlanta GA
UPDATE businesses SET zip_code = '35901' WHERE id = '4d4f373a-7bbc-4c5c-b452-19a5d209cc3a'; -- Gadsden State CC, Gadsden AL
UPDATE businesses SET zip_code = '29631' WHERE id = '8abf4585-5d75-450e-b54c-6417c3b5b259'; -- Infinite Seeds Academy, Clemson SC
UPDATE businesses SET zip_code = '35221' WHERE id = 'e2407df6-9f1e-44f6-9458-e23cfe2c39f4'; -- Lawson State CC, Birmingham AL
UPDATE businesses SET zip_code = '30303' WHERE id = 'a94b9ad3-8813-456a-a453-4fae508541b6'; -- LMI East Africa, Atlanta GA
UPDATE businesses SET zip_code = '20036' WHERE id = 'ad839f6d-e2a7-40d3-991b-1c5b82d88534'; -- Marjenk Consulting, Washington DC
UPDATE businesses SET zip_code = '20036' WHERE id = '3df33c62-f355-4472-afef-cde085affc1b'; -- Market Me Consulting, Washington DC
UPDATE businesses SET zip_code = '30303' WHERE id = '78664385-b80b-4c39-9fcb-0c8bb5610721'; -- My Inspired Career, Atlanta GA
UPDATE businesses SET zip_code = '77004' WHERE id = '315574af-cd6f-47db-a4e3-1fa4724e61c5'; -- Natl Assoc Black Geoscientists, Houston TX
UPDATE businesses SET zip_code = '60655' WHERE id = 'deaa774b-88e7-4855-a858-167a646c8ace'; -- Next Level Coaching, Chicago IL
UPDATE businesses SET zip_code = '35896' WHERE id = '0b6a8b92-4864-4786-9789-48453f0cb0da'; -- Oakwood University, Huntsville AL
UPDATE businesses SET zip_code = '33131' WHERE id = '6f49f888-d1b8-4a2d-8848-b84ccd6c1651'; -- Quintairos Prieto, Miami FL
UPDATE businesses SET zip_code = '27701' WHERE id = 'e9eeb050-895f-4b9d-af90-66f84a8b0a45'; -- Rural Beacon Initiative, Durham NC
UPDATE businesses SET zip_code = '36701' WHERE id = 'c2b81768-e95e-4113-978e-a21e14ffdc20'; -- Selma University, Selma AL
UPDATE businesses SET zip_code = '35405' WHERE id = '3935430a-30b6-4372-a07a-9f42f358e9d1'; -- Shelton State CC, Tuscaloosa AL
UPDATE businesses SET zip_code = '70112' WHERE id = 'edc51d8e-e009-494e-9e13-303b9c942ae6'; -- STEM NOLA, New Orleans LA
UPDATE businesses SET zip_code = '30303' WHERE id = '9f3bd430-d01f-41ce-988d-c2b7255811d5'; -- The Green Fund, Atlanta GA
UPDATE businesses SET zip_code = '36104' WHERE id = '7df9fc56-2b29-4df9-a993-49a58bf01a38'; -- Trenholm State CC, Montgomery AL
UPDATE businesses SET zip_code = '30303' WHERE id = '7361a585-d567-499b-9559-aa184faa5e1f'; -- Unique Creations, Atlanta GA
UPDATE businesses SET zip_code = '77004' WHERE id = '82cd3b2c-9854-4e43-b12f-5a7c18d94e21'; -- Unity National Bank, Houston TX

-- Fix 2 businesses missing descriptions
UPDATE businesses SET description = 'A faith-based community outreach center in Buffalo, NY providing essential services, food assistance, and support programs to underserved communities.', category = 'Non-profit Organization' WHERE id = 'f3776cb0-6f2c-45bf-95cb-b5b11a095875'; -- Durham Memorial Outreach
UPDATE businesses SET description = 'A diversified real estate development and investment firm based in Lithonia, Georgia, specializing in commercial and residential property ventures.', category = 'Real Estate Development' WHERE id = '80c221f5-b104-4ad1-a50c-94627e88344d'; -- CookWilliams Enterprises

-- Fix missing category for Infinite Seeds Academy
UPDATE businesses SET category = 'Education & Training' WHERE id = '8abf4585-5d75-450e-b54c-6417c3b5b259';

-- Fix 17 businesses missing banner images using high-quality placeholder banners by category
UPDATE businesses SET banner_url = '/images/businesses/daycare-banner.jpg' WHERE id IN (
  'a1b2c3d4-e5f6-7890-abcd-300000000006', -- Goody Goody Gumdrops
  'a1b2c3d4-e5f6-7890-abcd-300000000007', -- Dianna's Home Daycare
  'a1b2c3d4-e5f6-7890-abcd-300000000008', -- Kenyatta's Day Care
  'a1b2c3d4-e5f6-7890-abcd-300000000009', -- Huge Hugs Daycare
  'a1b2c3d4-e5f6-7890-abcd-300000000010'  -- Alpha Learning Center
);

UPDATE businesses SET banner_url = '/images/businesses/barbershop-banner.jpg' WHERE id IN (
  'a1b2c3d4-e5f6-7890-abcd-100000000001', -- The Beard Bar ATL
  'a1b2c3d4-e5f6-7890-abcd-100000000002'  -- Royal Roots Barber Shop
);

UPDATE businesses SET banner_url = '/images/businesses/salon-banner.jpg' WHERE id IN (
  'a1b2c3d4-e5f6-7890-abcd-200000000001', -- Hair & Co BKLYN
  'a1b2c3d4-e5f6-7890-abcd-200000000002'  -- The Beauty Boutique
);

UPDATE businesses SET banner_url = '/images/businesses/restaurant-banner.jpg' WHERE id IN (
  'a1b2c3d4-e5f6-7890-abcd-200000000003', -- Jamit Bistro
  'a1b2c3d4-e5f6-7890-abcd-200000000004', -- Bamboo Walk
  'a1b2c3d4-e5f6-7890-abcd-300000000002', -- Portillo's
  'a1b2c3d4-e5f6-7890-abcd-300000000003', -- Garrett Popcorn
  'a1b2c3d4-e5f6-7890-abcd-300000000004'  -- I-57 Rib House
);

UPDATE businesses SET banner_url = '/images/businesses/retail-banner.jpg' WHERE id = 'a1b2c3d4-e5f6-7890-abcd-300000000001'; -- Apparel Redefined

UPDATE businesses SET banner_url = '/images/businesses/icecream-banner.jpg' WHERE id = 'a1b2c3d4-e5f6-7890-abcd-300000000005'; -- Jodi's Italian Ice

UPDATE businesses SET banner_url = '/images/businesses/agriculture-banner.jpg' WHERE id = '8f42b1c3-5d9e-4a7b-b2e1-9c3f4d5a6e7b'; -- NBFA