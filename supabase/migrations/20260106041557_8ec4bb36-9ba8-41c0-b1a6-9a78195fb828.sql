-- Add validation columns to b2b_external_leads table
ALTER TABLE public.b2b_external_leads
ADD COLUMN IF NOT EXISTS validation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS website_valid boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone_valid boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS data_quality_score integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_validated_at timestamptz DEFAULT NULL,
ADD COLUMN IF NOT EXISTS validation_notes text DEFAULT NULL;

-- Add index for validation status
CREATE INDEX IF NOT EXISTS idx_b2b_external_leads_validation_status 
ON public.b2b_external_leads(validation_status);

-- Create comment for documentation
COMMENT ON COLUMN public.b2b_external_leads.validation_status IS 'Status of validation: pending, validating, validated, failed';
COMMENT ON COLUMN public.b2b_external_leads.website_valid IS 'Whether the website URL is accessible';
COMMENT ON COLUMN public.b2b_external_leads.phone_valid IS 'Whether the phone number format is valid';
COMMENT ON COLUMN public.b2b_external_leads.data_quality_score IS 'Quality score from 0-100 based on data completeness';