-- Add payout configuration fields to directory_partners
ALTER TABLE public.directory_partners
ADD COLUMN IF NOT EXISTS payout_frequency text NOT NULL DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS minimum_payout_threshold numeric NOT NULL DEFAULT 50.00,
ADD COLUMN IF NOT EXISTS last_payout_date timestamp with time zone;

-- Add constraint to ensure valid payout frequencies
ALTER TABLE public.directory_partners
ADD CONSTRAINT valid_payout_frequency CHECK (payout_frequency IN ('weekly', 'biweekly', 'monthly', 'net30'));

-- Add constraint to ensure minimum threshold is positive
ALTER TABLE public.directory_partners
ADD CONSTRAINT positive_payout_threshold CHECK (minimum_payout_threshold >= 0);

-- Update existing partners to have the default monthly/$50 threshold
UPDATE public.directory_partners 
SET payout_frequency = 'monthly', minimum_payout_threshold = 50.00
WHERE payout_frequency IS NULL OR minimum_payout_threshold IS NULL;