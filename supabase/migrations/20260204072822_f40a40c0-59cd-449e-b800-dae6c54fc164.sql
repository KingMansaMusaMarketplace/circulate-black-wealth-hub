-- Add expiration tracking for BHM listings
ALTER TABLE public.b2b_external_leads
ADD COLUMN IF NOT EXISTS listing_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Add index for expiration queries
CREATE INDEX IF NOT EXISTS idx_b2b_external_leads_expires 
ON public.b2b_external_leads(listing_expires_at) 
WHERE listing_expires_at IS NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.b2b_external_leads.listing_type IS 'free, bhm_promo, or standard';
COMMENT ON COLUMN public.b2b_external_leads.listing_expires_at IS 'When the paid listing expires and needs renewal';