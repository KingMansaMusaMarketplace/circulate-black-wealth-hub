-- Drop the broken audit trigger that references non-existent 'role' column
DROP TRIGGER IF EXISTS trigger_audit_role_changes ON public.profiles;
DROP FUNCTION IF EXISTS public.audit_role_changes();

-- Add founding member tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_founding_member boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS founding_member_since timestamp with time zone;

-- Update existing users who signed up before January 2027 to be founding members
UPDATE public.profiles 
SET is_founding_member = true, 
    founding_member_since = created_at 
WHERE created_at < '2027-01-31T23:59:59Z';

-- Create a function to automatically set founding member status for new signups
CREATE OR REPLACE FUNCTION public.set_founding_member_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If signing up before January 2027, mark as founding member
  IF NEW.created_at < '2027-01-31T23:59:59Z' THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set founding member status on insert
DROP TRIGGER IF EXISTS set_founding_member_on_signup ON public.profiles;
CREATE TRIGGER set_founding_member_on_signup
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_founding_member_status();