
-- Set addresses for remaining 2 businesses (no public street address found, using city-based placeholder)
UPDATE businesses SET city = 'Chicago', state = 'IL' WHERE id = 'df1024ac-4576-4f81-85dd-95f35d87445a';
UPDATE businesses SET address = 'Bowie, MD' WHERE id = '04b9d571-1b90-4e58-96d2-c45218b7ba36';
