-- Set correct coordinates for the verified Durham, NC listing
UPDATE businesses SET latitude = 35.9940, longitude = -78.9020, address = '301 Darby St' WHERE id = '87c17ea8-cc8a-4e54-9fb5-dd8ce5502db2';

-- Delete the 3 duplicate/incorrect entries
DELETE FROM businesses WHERE id IN ('4f682d72-2a00-4f9f-862e-513191d7ddc3', 'f3776cb0-6f2c-45bf-95cb-b5b11a095875', '0c61ae7f-c102-4be1-b3f2-fd863135ef6a');