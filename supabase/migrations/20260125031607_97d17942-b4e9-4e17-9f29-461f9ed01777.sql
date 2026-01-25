-- Update the founding member cutoff date to September 1, 2026
-- This extends the founding member period to give more runway for business acquisition

CREATE OR REPLACE FUNCTION public.set_founding_member_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If signing up before September 1, 2026, mark as founding member
  IF NEW.created_at < '2026-09-01T23:59:59Z' THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

-- Also update the founding sponsor function for businesses
CREATE OR REPLACE FUNCTION public.set_founding_sponsor_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If business created before September 1, 2026, mark as founding sponsor
  IF NEW.created_at < '2026-09-01T23:59:59Z' THEN
    NEW.is_founding_sponsor := true;
    NEW.founding_sponsor_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;