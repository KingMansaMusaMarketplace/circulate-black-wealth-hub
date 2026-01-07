-- Set all existing businesses to 'live' listing status so they appear in directory
UPDATE public.businesses 
SET listing_status = 'live' 
WHERE listing_status = 'draft' OR listing_status IS NULL;