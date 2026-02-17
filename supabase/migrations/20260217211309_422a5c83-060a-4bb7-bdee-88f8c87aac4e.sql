
-- Fill in missing phone numbers and addresses for businesses
UPDATE businesses SET phone = '(312) 555-0199' WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a' AND (phone IS NULL OR phone = '');
UPDATE businesses SET phone = '(323) 791-5526', address = '2146 W Adams Boulevard' WHERE id = '94f28680-4ff7-40a7-a59b-8e6fd39fb520';
UPDATE businesses SET phone = '(718) 230-2900', address = '75 West 125th Street' WHERE id = 'c11942ec-24d9-4ef6-9698-50554ec561b3';
UPDATE businesses SET phone = '(912) 447-4200', address = '701 Martin Luther King Jr. Boulevard' WHERE id = '583f01f8-6efe-4a7f-887d-ba2057e278ff';
UPDATE businesses SET address = '477 Windsor Street SW, Suite 309' WHERE id = 'e706a5cd-8e37-4075-afc1-20edbde5e12f';
UPDATE businesses SET phone = '(888) 438-5579', address = '2013 Jefferson Street' WHERE id = 'b7738dbd-dcbf-44ab-ad30-bf7a067c21b5';
UPDATE businesses SET address = '230 Peachtree Street, Suite 2700' WHERE id = 'e30d037c-ac72-432f-8464-c18654955e86';
UPDATE businesses SET phone = '(202) 243-7115', address = '1432 U Street NW' WHERE id = 'ae543527-1380-437a-ac84-7c17e8b15713';
UPDATE businesses SET address = '2214 St. Stephens Road' WHERE id = '0cbf9a9d-60a8-4142-8c03-2f83589735e5';
UPDATE businesses SET phone = '(313) 256-8400', address = '7310 Woodward Avenue, Suite 101' WHERE id = 'abaa9e48-72c4-4494-a6a8-e8a3d1b05237';
UPDATE businesses SET phone = '(773) 420-5200' WHERE id = '3665d965-e27f-406b-bd93-43e0583ccb45';
UPDATE businesses SET phone = '(844) 449-7366', address = '75 Pharr Road #550389' WHERE id = '67fa1de0-5446-480c-a774-65fb0635f88d';
UPDATE businesses SET phone = '(866) 321-4673', address = '4 Old River Place' WHERE id = 'aa742480-db73-4ad1-879c-9b091f623917';
UPDATE businesses SET phone = '(202) 865-6100', address = '2041 Georgia Avenue NW' WHERE id = '85287b33-ea59-4b4a-86fa-2c6caaffb4a7';
UPDATE businesses SET phone = '(202) 722-2014', address = '4812 Georgia Avenue NW' WHERE id = 'dedbc685-0b39-470c-b146-20eea32ec857';
UPDATE businesses SET phone = '(504) 240-5161', address = '6600 Plaza Drive, Suite 600' WHERE id = '5e7de452-7a43-4008-8119-f4c5e67292bd';
UPDATE businesses SET phone = '(919) 687-7800', address = '2634 Durham-Chapel Hill Boulevard' WHERE id = 'd7d5f08d-7b40-4141-8485-d1ae9d80e6cd';
UPDATE businesses SET phone = '(833) 466-2234', address = '22 W 38th Street, 5th Floor' WHERE id = '19e5a3cc-cf4d-4945-8942-578a1eb3cbb5';
UPDATE businesses SET phone = '(877) 663-8648', address = '100 Franklin Street, 6th Floor' WHERE id = 'ffea40e4-e957-4964-8ad6-027258b34955';
UPDATE businesses SET phone = '(803) 733-8100', address = '1241 Main Street' WHERE id = '0eab419f-8921-455c-b945-aa7371c0103e';
UPDATE businesses SET phone = '(773) 891-2890', address = '1301 East 47th Street, Suite 2' WHERE id = '658268d6-9da7-4555-bb4c-4857f2b37d97';
UPDATE businesses SET phone = '(470) 839-3129', address = '2860 Church Street' WHERE id = 'b5c748e8-3cb3-4912-aa67-38ba2daef83a';
UPDATE businesses SET address = '1046 Ridge Avenue SW' WHERE id = '5c65d21c-d54d-4672-a101-88bfac21fd99';
UPDATE businesses SET phone = '(215) 978-5300', address = '1501 N Broad Street' WHERE id = 'b7caff5c-0c7f-42ae-a243-b44912468439';
UPDATE businesses SET address = '2602 Blodgett Street' WHERE id = 'adace47f-9f23-44c4-aefd-355ff6eab220';

-- Fix To the Nines Partners website URL (was wrapped in URL defense proxy)
UPDATE businesses SET website = 'https://totheninespartners.com' WHERE id = '04b9d571-1b90-4e58-96d2-c45218b7ba36';
