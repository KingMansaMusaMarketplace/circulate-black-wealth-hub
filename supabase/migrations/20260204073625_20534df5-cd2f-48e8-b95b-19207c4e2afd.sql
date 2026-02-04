-- Add call_status field for tracking free listing outreach
ALTER TABLE public.b2b_external_leads 
ADD COLUMN IF NOT EXISTS call_status text DEFAULT 'not_called';

-- Add call_notes for recording conversation details
ALTER TABLE public.b2b_external_leads 
ADD COLUMN IF NOT EXISTS call_notes text;

-- Add called_at timestamp
ALTER TABLE public.b2b_external_leads 
ADD COLUMN IF NOT EXISTS called_at timestamptz;

-- Add index for efficient querying of free listings
CREATE INDEX IF NOT EXISTS idx_b2b_external_leads_listing_type_call_status 
ON public.b2b_external_leads(listing_type, call_status) 
WHERE listing_type = 'free';

-- Add comment for documentation
COMMENT ON COLUMN public.b2b_external_leads.call_status IS 'Outreach status: not_called, called_interested, called_converted, declined, no_answer, callback_scheduled';