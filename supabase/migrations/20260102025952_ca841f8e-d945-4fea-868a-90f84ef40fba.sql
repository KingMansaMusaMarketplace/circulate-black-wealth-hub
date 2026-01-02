-- Add lead scoring and tracking columns to b2b_external_leads
ALTER TABLE public.b2b_external_leads
ADD COLUMN IF NOT EXISTS confidence_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_score numeric GENERATED ALWAYS AS (
  COALESCE(confidence_score, 0) * 100
) STORED,
ADD COLUMN IF NOT EXISTS invitation_clicked_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS invitation_token uuid DEFAULT gen_random_uuid();

-- Create index for faster email lookups during auto-conversion
CREATE INDEX IF NOT EXISTS idx_b2b_external_leads_email 
ON public.b2b_external_leads ((contact_info->>'email'));

-- Create function to auto-convert leads when a business signs up with matching email
CREATE OR REPLACE FUNCTION public.auto_convert_external_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Update any external leads that match the new business email
  UPDATE public.b2b_external_leads
  SET 
    is_converted = true,
    converted_business_id = NEW.id,
    updated_at = now()
  WHERE 
    is_converted = false
    AND contact_info->>'email' IS NOT NULL
    AND LOWER(contact_info->>'email') = LOWER(NEW.email);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on businesses table
DROP TRIGGER IF EXISTS trigger_auto_convert_lead ON public.businesses;
CREATE TRIGGER trigger_auto_convert_lead
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_convert_external_lead();