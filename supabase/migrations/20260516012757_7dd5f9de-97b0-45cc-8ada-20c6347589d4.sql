
-- 1) Backfill: activate beta testers whose email matches an existing profile
UPDATE public.beta_testers bt
SET 
  status = 'active',
  user_id = p.id,
  signed_up_at = COALESCE(bt.signed_up_at, p.created_at)
FROM public.profiles p
WHERE LOWER(p.email) = LOWER(bt.email)
  AND bt.status = 'invited';

-- 2) Trigger: auto-activate beta tester when a matching profile is created
CREATE OR REPLACE FUNCTION public.auto_activate_beta_tester()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    UPDATE public.beta_testers
    SET 
      status = 'active',
      user_id = NEW.id,
      signed_up_at = COALESCE(signed_up_at, now())
    WHERE LOWER(email) = LOWER(NEW.email)
      AND status = 'invited';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_activate_beta_tester ON public.profiles;
CREATE TRIGGER trg_auto_activate_beta_tester
AFTER INSERT OR UPDATE OF email ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_activate_beta_tester();
