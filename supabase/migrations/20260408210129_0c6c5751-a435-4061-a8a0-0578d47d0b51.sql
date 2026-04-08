
ALTER TABLE public.businesses REPLICA IDENTITY DEFAULT;

UPDATE businesses SET listing_status = 'live' WHERE id = '87c17ea8-cc8a-4e54-9fb5-dd8ce5502db2';
