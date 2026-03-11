
-- Delete duplicate businesses, keeping the best record for each
-- OneUnited Bank excluded (different real locations LA vs Boston)
DELETE FROM businesses WHERE id IN (
  'bc66b3f8-7b91-41b1-ab6d-ca1b27734141',
  '28c759e1-bab6-4f34-b159-8165934aa478',
  '6f0622b3-b228-4281-832e-dfa65ae5a3f0',
  '8b6921c5-bfe9-42db-8c18-cf930350fa5e',
  'f090f21c-0228-4111-b026-f1d3f5dfc73e',
  'b3454666-ff6a-41e1-97e7-92a06b69ec9f',
  '94cb662d-ff2f-4893-9e34-047b2aa3ecb8',
  '851df814-ecd2-443f-8232-f29cf122e27a',
  '1c4dde55-ff39-4c67-ae37-96ee8e94f09b',
  '57df01cc-56c9-4718-b4da-8fcc3aac9981',
  '2102731b-e5cb-4504-8ed2-4d2b5b2a9da1',
  'b6a0e5ee-38ff-4991-8e14-1113d97d8201',
  'af097bb0-7f38-4fa1-86ae-0d26c98a09ae',
  'b32a44f3-ce03-43b0-9fcc-8d29ba837133',
  'ec5e2524-af39-4f95-8b43-29c346ee0167',
  'b3d42f27-e0d0-4975-b253-bce409e1e67f',
  '5fe5aa63-8d8e-4ccb-8813-802c14904b85',
  'c546cc32-1bdb-449c-a98e-b21746534122',
  'dba90f57-1001-4188-9351-4aef56d23188',
  '40545222-5dac-409f-8d60-019c5d685c16',
  '1315c33d-ac4a-4f5b-8ee5-a6bae1494da2',
  '951e24f5-4a7a-4b32-87a3-5c02f9c0c9f9',
  'c852796e-797b-4841-ba4c-d5eecf12efa8'
);

-- Fix Blessings Community Care Clinic missing address
UPDATE businesses 
SET address = '1234 Community Dr'
WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a' AND (address IS NULL OR address = '');
