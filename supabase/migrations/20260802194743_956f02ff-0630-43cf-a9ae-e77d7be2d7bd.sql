-- 1. Susu escrow: require a verified payment reference before a contribution can be held/released
CREATE OR REPLACE FUNCTION public.enforce_susu_escrow_payment_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('held', 'released', 'completed') THEN
    IF NEW.payment_reference IS NULL OR btrim(NEW.payment_reference) = '' THEN
      RAISE EXCEPTION 'Escrow record cannot be marked % without a verified payment reference', NEW.status
        USING ERRCODE = '23514';
    END IF;
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.payment_reference IS NOT NULL
     AND NEW.payment_reference IS DISTINCT FROM OLD.payment_reference
     AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Payment reference cannot be altered' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_susu_escrow_payment_verified ON public.susu_escrow;
CREATE TRIGGER trg_susu_escrow_payment_verified
BEFORE INSERT OR UPDATE ON public.susu_escrow
FOR EACH ROW EXECUTE FUNCTION public.enforce_susu_escrow_payment_verified();

-- 2. Challenge tables: restrict reads to fellow participants / admins
CREATE OR REPLACE FUNCTION public.is_challenge_participant(_challenge_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.challenge_participants cp
    WHERE cp.challenge_id = _challenge_id
      AND cp.user_id = _user_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_challenge_participant(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_challenge_participant(uuid, uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Authenticated users can view challenge activities" ON public.challenge_activities;
CREATE POLICY "Participants and admins can view challenge activities"
ON public.challenge_activities
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_challenge_participant(challenge_id, auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Authenticated users can view participants" ON public.challenge_participants;
CREATE POLICY "Participants and admins can view participants"
ON public.challenge_participants
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_challenge_participant(challenge_id, auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);