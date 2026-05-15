-- Ensure all beta tester codes remain valid through January 1, 2027
ALTER TABLE public.beta_testers ALTER COLUMN expiration_date SET DEFAULT '2027-01-01 00:00:00+00';

UPDATE public.beta_testers
SET expiration_date = '2027-01-01 00:00:00+00'
WHERE expiration_date IS NULL OR expiration_date < '2027-01-01 00:00:00+00';