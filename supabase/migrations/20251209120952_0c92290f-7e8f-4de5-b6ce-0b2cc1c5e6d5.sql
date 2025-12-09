-- Add founding sponsor columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS is_founding_sponsor BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS founding_sponsor_since TIMESTAMP WITH TIME ZONE;

-- Create function to set founding sponsor status
CREATE OR REPLACE FUNCTION public.set_founding_sponsor_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If business created before January 2027, mark as founding sponsor
  IF NEW.created_at < '2027-01-31T23:59:59Z' THEN
    NEW.is_founding_sponsor := true;
    NEW.founding_sponsor_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger for new businesses
DROP TRIGGER IF EXISTS set_founding_sponsor_on_create ON public.businesses;
CREATE TRIGGER set_founding_sponsor_on_create
  BEFORE INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_founding_sponsor_status();

-- Update existing businesses created before the cutoff date
UPDATE public.businesses
SET 
  is_founding_sponsor = true,
  founding_sponsor_since = created_at
WHERE created_at < '2027-01-31T23:59:59Z'
AND (is_founding_sponsor IS NULL OR is_founding_sponsor = false);