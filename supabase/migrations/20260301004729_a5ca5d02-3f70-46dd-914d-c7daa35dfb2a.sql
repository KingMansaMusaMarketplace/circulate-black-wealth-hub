
-- Batch 1: BHM Bank through HEALing Community Health
UPDATE public.businesses SET latitude = 33.5186, longitude = -86.8104 WHERE id = '1909b5a1-e5d2-4d6a-9996-208903221a21';
UPDATE public.businesses SET latitude = 41.8827, longitude = -87.6233 WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a';
UPDATE public.businesses SET latitude = 34.0289, longitude = -118.3127 WHERE id = '94f28680-4ff7-40a7-a59b-8e6fd39fb520';
UPDATE public.businesses SET latitude = 40.8088, longitude = -73.9437 WHERE id = 'c11942ec-24d9-4ef6-9698-50554ec561b3';
UPDATE public.businesses SET latitude = 32.0656, longitude = -81.1004 WHERE id = '583f01f8-6efe-4a7f-887d-ba2057e278ff';
UPDATE public.businesses SET latitude = 33.7377, longitude = -84.4133 WHERE id = 'e706a5cd-8e37-4075-afc1-20edbde5e12f';
UPDATE public.businesses SET latitude = 36.1674, longitude = -86.7960 WHERE id = 'b7738dbd-dcbf-44ab-ad30-bf7a067c21b5';
UPDATE public.businesses SET latitude = 33.7581, longitude = -84.3871 WHERE id = 'e30d037c-ac72-432f-8464-c18654955e86';
UPDATE public.businesses SET latitude = 38.9170, longitude = -77.0353 WHERE id = 'ae543527-1380-437a-ac84-7c17e8b15713';
UPDATE public.businesses SET latitude = 43.0590, longitude = -87.9403 WHERE id = '5a6f75cf-26d9-44f3-ab48-1500066c24e6';
UPDATE public.businesses SET latitude = 30.6889, longitude = -88.0582 WHERE id = '0cbf9a9d-60a8-4142-8c03-2f83589735e5';
UPDATE public.businesses SET latitude = 40.7516, longitude = -74.0009 WHERE id = 'd0c50a3e-01e5-44ee-ab62-5f0e036aafdb';
UPDATE public.businesses SET latitude = 42.3734, longitude = -83.0784 WHERE id = 'abaa9e48-72c4-4494-a6a8-e8a3d1b05237';
UPDATE public.businesses SET latitude = 41.8124, longitude = -87.6167 WHERE id = '3665d965-e27f-406b-bd93-43e0583ccb45';
UPDATE public.businesses SET latitude = 33.8168, longitude = -84.3653 WHERE id = '67fa1de0-5446-480c-a774-65fb0635f88d';
UPDATE public.businesses SET latitude = 33.7227, longitude = -84.4821 WHERE id = '46912a78-7dd2-4143-bd3c-3b3d9cb4cc24';
UPDATE public.businesses SET latitude = 32.3113, longitude = -90.1837 WHERE id = 'aa742480-db73-4ad1-879c-9b091f623917';

-- Batch 2: Howard University Hospital through Unity National Bank
UPDATE public.businesses SET latitude = 38.9197, longitude = -77.0196 WHERE id = '85287b33-ea59-4b4a-86fa-2c6caaffb4a7';
UPDATE public.businesses SET latitude = 38.9414, longitude = -77.0276 WHERE id = 'dedbc685-0b39-470c-b146-20eea32ec857';
UPDATE public.businesses SET latitude = 29.9912, longitude = -90.0330 WHERE id = '5e7de452-7a43-4008-8119-f4c5e67292bd';
UPDATE public.businesses SET latitude = 33.7490, longitude = -84.3880 WHERE id = '56c2ad1b-9f8c-444d-8027-82b0aa24257e';
UPDATE public.businesses SET latitude = 35.9810, longitude = -78.9470 WHERE id = 'd7d5f08d-7b40-4141-8485-d1ae9d80e6cd';
UPDATE public.businesses SET latitude = 40.7527, longitude = -73.9845 WHERE id = '19e5a3cc-cf4d-4945-8942-578a1eb3cbb5';
UPDATE public.businesses SET latitude = 36.5357, longitude = -78.3147 WHERE id = '8f42b1c3-5d9e-4a7b-b2e1-9c3f4d5a6e7b';
UPDATE public.businesses SET latitude = 42.3554, longitude = -71.0587 WHERE id = 'ffea40e4-e957-4964-8ad6-027258b34955';
UPDATE public.businesses SET latitude = 34.0007, longitude = -81.0348 WHERE id = '0eab419f-8921-455c-b945-aa7371c0103e';
UPDATE public.businesses SET latitude = 33.7710, longitude = -84.3856 WHERE id = 'bfe46fbb-87e5-4449-a9ec-99f1c30ea9fb';
UPDATE public.businesses SET latitude = 41.7965, longitude = -87.5936 WHERE id = '658268d6-9da7-4555-bb4c-4857f2b37d97';
UPDATE public.businesses SET latitude = 33.7370, longitude = -84.3963 WHERE id = 'b5c748e8-3cb3-4912-aa67-38ba2daef83a';
UPDATE public.businesses SET latitude = 33.7190, longitude = -84.4130 WHERE id = '5c65d21c-d54d-4672-a101-88bfac21fd99';
UPDATE public.businesses SET latitude = 33.5184, longitude = -84.3515 WHERE id = '0138c15f-c41a-4b93-a382-f527ca67a6f6';
UPDATE public.businesses SET latitude = 39.2818, longitude = -76.5950 WHERE id = '8d60bf8d-c333-40e0-b856-d13fcd14db26';
UPDATE public.businesses SET latitude = 39.9526, longitude = -75.1652 WHERE id = 'b7caff5c-0c7f-42ae-a243-b44912468439';
UPDATE public.businesses SET latitude = 29.7604, longitude = -95.3698 WHERE id = 'adace47f-9f23-44c4-aefd-355ff6eab220';

-- Durham Memorial AME Zion Church (the one from the screenshot)
UPDATE public.businesses SET latitude = 35.9940, longitude = -78.9020 WHERE id IN (
  SELECT id FROM public.businesses WHERE name ILIKE '%Durham Memorial%' AND (latitude IS NULL OR latitude = 0)
);
