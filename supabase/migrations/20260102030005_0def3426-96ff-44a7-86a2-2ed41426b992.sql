-- Fix function search path for auto_convert_external_lead
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;