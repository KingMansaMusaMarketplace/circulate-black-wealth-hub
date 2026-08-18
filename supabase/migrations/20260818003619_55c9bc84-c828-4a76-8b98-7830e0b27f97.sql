SELECT set_config('app.trusted_founding_claim','true', true);
UPDATE public.founding_member_slots
SET business_id = '01aee255-5b15-4a2d-be76-0a8b3a3b102f'
WHERE slot_number = 1 AND user_id = 'bd72a75e-1310-4f40-9c74-380443b09d9b';
UPDATE public.businesses
SET owner_id = 'bd72a75e-1310-4f40-9c74-380443b09d9b'
WHERE id = '01aee255-5b15-4a2d-be76-0a8b3a3b102f';