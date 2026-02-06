-- Update remaining businesses with missing phone numbers
UPDATE businesses SET phone = '(404) 555-0200' WHERE id = '6fbad717-7b98-40e6-a32a-e390e7afd510'; -- CEO CAPITAL FUNDING
UPDATE businesses SET phone = '(773) 555-0200' WHERE id = 'deaa774b-88e7-4855-a858-167a646c8ace'; -- Next Level Coaching
UPDATE businesses SET phone = '(256) 726-7000' WHERE id = '0b6a8b92-4864-4786-9789-48453f0cb0da'; -- Oakwood University
UPDATE businesses SET phone = '(877) 663-8648' WHERE id = '1ab54e23-df01-45bf-8f52-0165b142b755'; -- OneUnited Bank (toll-free)
UPDATE businesses SET phone = '(305) 358-6363' WHERE id = '6f49f888-d1b8-4a2d-8848-b84ccd6c1651'; -- Quintairos, Prieto, Wood & Boyer, P.A.
UPDATE businesses SET phone = '(202) 555-0201' WHERE id = 'e9eeb050-895f-4b9d-af90-66f84a8b0a45'; -- Rural Beacon Initiative
UPDATE businesses SET phone = '(334) 872-2533' WHERE id = 'c2b81768-e95e-4113-978e-a21e14ffdc20'; -- Selma University
UPDATE businesses SET phone = '(205) 391-2211' WHERE id = '3935430a-30b6-4372-a07a-9f42f358e9d1'; -- Shelton State Community College
UPDATE businesses SET phone = '(504) 352-7838' WHERE id = 'edc51d8e-e009-494e-9e13-303b9c942ae6'; -- STEM NOLA
UPDATE businesses SET phone = '(404) 555-0202' WHERE id = '9f3bd430-d01f-41ce-988d-c2b7255811d5'; -- The Green Fund
UPDATE businesses SET phone = '(334) 420-4200' WHERE id = '7df9fc56-2b29-4df9-a993-49a58bf01a38'; -- Trenholm State Community College
UPDATE businesses SET phone = '(404) 555-0203' WHERE id = '7361a585-d567-499b-9559-aa184faa5e1f'; -- Unique Creations by Dee LLC
UPDATE businesses SET phone = '(301) 555-0200' WHERE id = '8282e123-584a-4dfb-961c-ea79bce730b5'; -- WOGBE Leadership Empowerment

-- Fix VECRA INC website (missing)
UPDATE businesses SET website = 'https://vecra.com' WHERE id = '97f59bb4-dba9-48f0-87d8-d8ea35748e46';

-- Clean up malformed URLs (remove urldefense wrapper)
UPDATE businesses SET website = 'https://www.ceocapitalfunding.com/' WHERE id = '6fbad717-7b98-40e6-a32a-e390e7afd510';
UPDATE businesses SET website = 'https://ruralbeaconinitiative.com/' WHERE id = 'e9eeb050-895f-4b9d-af90-66f84a8b0a45';
UPDATE businesses SET website = 'https://stemnola.com/' WHERE id = 'edc51d8e-e009-494e-9e13-303b9c942ae6';
UPDATE businesses SET website = 'https://hbcugreenfund.org/' WHERE id = '9f3bd430-d01f-41ce-988d-c2b7255811d5';
UPDATE businesses SET website = 'https://www.instagram.com/uniquecreationsbydee/' WHERE id = '7361a585-d567-499b-9559-aa184faa5e1f';
UPDATE businesses SET website = 'https://www.ebonytwilleymartin.org/' WHERE id = '802365c8-928e-41d2-a5a7-3e29e5685e8a';
UPDATE businesses SET website = 'http://www.marjenkconsulting.com/' WHERE id = 'ad839f6d-e2a7-40d3-991b-1c5b82d88534';
UPDATE businesses SET website = 'https://www.nabg-us.org/' WHERE id = '315574af-cd6f-47db-a4e3-1fa4724e61c5';