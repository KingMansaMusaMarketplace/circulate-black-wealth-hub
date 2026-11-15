-- Access requests may now come from a doctor's staff invite (still owner-approved).
CREATE OR REPLACE FUNCTION public.hc_access_requests_pilot_check()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.request_source NOT IN ('general','pilot','staff_invite') THEN
    RAISE EXCEPTION 'invalid request source';
  END IF;
  IF NEW.request_source IN ('pilot','staff_invite') AND NEW.test_only_attested_at IS NULL THEN
    RAISE EXCEPTION 'pilot requests require the test-patients-only attestation';
  END IF;
  IF NEW.npi IS NOT NULL AND NEW.npi !~ '^[0-9]{10}$' THEN
    RAISE EXCEPTION 'NPI must be 10 digits';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.request_source IS DISTINCT FROM OLD.request_source THEN
    RAISE EXCEPTION 'request source cannot change';
  END IF;
  RETURN NEW;
END $function$;

-- ---------- Team invitations ----------
CREATE TABLE public.hc_team_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL,
  invited_by uuid NOT NULL,
  invited_by_email text,
  access_request_id uuid REFERENCES public.hc_access_requests(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'requested',
  last_emailed_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hc_team_invites TO authenticated;
GRANT ALL ON public.hc_team_invites TO service_role;
ALTER TABLE public.hc_team_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read clinic invites" ON public.hc_team_invites FOR SELECT TO authenticated USING (public.hc_is_owner(clinic_id));
CREATE UNIQUE INDEX hc_team_invites_one_open ON public.hc_team_invites (clinic_id, lower(email)) WHERE status = 'requested';
CREATE INDEX hc_team_invites_email ON public.hc_team_invites (lower(email)) WHERE status = 'requested';

CREATE OR REPLACE FUNCTION public.hc_team_invites_validate()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role NOT IN ('doctor','nurse','front_desk','biller') THEN RAISE EXCEPTION 'Role must be doctor, nurse, front desk or biller'; END IF;
  IF NEW.status NOT IN ('requested','joined','cancelled') THEN RAISE EXCEPTION 'invalid invite status'; END IF;
  NEW.email := lower(trim(NEW.email));
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.email) > 255 THEN RAISE EXCEPTION 'Enter a valid email'; END IF;
  IF length(trim(NEW.full_name)) < 2 OR length(NEW.full_name) > 120 THEN RAISE EXCEPTION 'Enter their full name'; END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.clinic_id := OLD.clinic_id; NEW.email := OLD.email; NEW.invited_by := OLD.invited_by; NEW.created_at := OLD.created_at;
    IF OLD.status <> 'requested' AND NEW.status <> OLD.status THEN RAISE EXCEPTION 'This invitation is already closed'; END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_team_invites_validate BEFORE INSERT OR UPDATE ON public.hc_team_invites FOR EACH ROW EXECUTE FUNCTION public.hc_team_invites_validate();

-- Owner creates an invite (called with the owner's own sign-in and approval proof).
CREATE OR REPLACE FUNCTION public.hc_create_team_invite(_clinic uuid, _email text, _name text, _role text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); e text := lower(trim(coalesce(_email,''))); me text; existing uuid; made uuid; cname text; today int;
BEGIN
  IF uid IS NULL OR NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can invite team members'; END IF;
  SELECT lower(email) INTO me FROM auth.users WHERE id = uid;
  IF e = me THEN RAISE EXCEPTION 'You are already on this clinic'; END IF;
  IF EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id = _clinic AND lower(email) = e) THEN RETURN jsonb_build_object('result','already_member'); END IF;
  SELECT id INTO existing FROM public.hc_team_invites WHERE clinic_id = _clinic AND email = e AND status = 'requested';
  IF existing IS NOT NULL THEN RETURN jsonb_build_object('result','exists','invite_id',existing); END IF;
  SELECT count(*) INTO today FROM public.hc_team_invites WHERE clinic_id = _clinic AND created_at > now() - interval '24 hours';
  IF today >= 10 THEN RETURN jsonb_build_object('result','limit'); END IF;
  SELECT name INTO cname FROM public.hc_clinics WHERE id = _clinic;
  INSERT INTO public.hc_team_invites (clinic_id, email, full_name, role, invited_by, invited_by_email)
  VALUES (_clinic, e, trim(_name), _role, uid, me) RETURNING id INTO made;
  RETURN jsonb_build_object('result','created','invite_id',made,'clinic_name',cname,'inviter_email',me);
END $$;

-- Owner-visible invite list with 1325's decision status only.
CREATE OR REPLACE FUNCTION public.hc_list_team_invites(_clinic uuid)
 RETURNS TABLE(id uuid, email text, full_name text, role text, status text, request_status text, created_at timestamptz, last_emailed_at timestamptz, joined_at timestamptz)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can see invitations'; END IF;
  RETURN QUERY SELECT i.id, i.email, i.full_name, i.role, i.status, r.status, i.created_at, i.last_emailed_at, i.joined_at
    FROM public.hc_team_invites i LEFT JOIN public.hc_access_requests r ON r.id = i.access_request_id
    WHERE i.clinic_id = _clinic ORDER BY i.created_at DESC LIMIT 100;
END $$;

CREATE OR REPLACE FUNCTION public.hc_cancel_team_invite(_invite uuid)
 RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE c uuid;
BEGIN
  SELECT clinic_id INTO c FROM public.hc_team_invites WHERE id = _invite;
  IF c IS NULL OR NOT public.hc_is_owner(c) THEN RAISE EXCEPTION 'Only the clinic owner can cancel invitations'; END IF;
  UPDATE public.hc_team_invites SET status = 'cancelled' WHERE id = _invite AND status = 'requested';
  RETURN FOUND;
END $$;

-- Invited person joins automatically once 1325 approved them and they signed in with that email.
CREATE OR REPLACE FUNCTION public.hc_claim_team_invites()
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); e text; inv record; n int := 0; last_clinic uuid;
BEGIN
  IF uid IS NULL OR NOT clinical_private.hc_has_preview_access() THEN RETURN jsonb_build_object('joined',0); END IF;
  SELECT lower(email) INTO e FROM auth.users WHERE id = uid AND email_confirmed_at IS NOT NULL;
  IF e IS NULL THEN RETURN jsonb_build_object('joined',0); END IF;
  FOR inv IN SELECT * FROM public.hc_team_invites WHERE email = e AND status = 'requested' ORDER BY created_at FOR UPDATE LOOP
    IF EXISTS (SELECT 1 FROM public.hc_clinics WHERE id = inv.clinic_id AND created_by = uid) THEN CONTINUE; END IF;
    INSERT INTO public.hc_members (clinic_id, user_id, role, email) VALUES (inv.clinic_id, uid, inv.role, e) ON CONFLICT (clinic_id, user_id) DO NOTHING;
    UPDATE public.hc_team_invites SET status = 'joined', joined_at = now() WHERE id = inv.id;
    n := n + 1; last_clinic := inv.clinic_id;
  END LOOP;
  RETURN jsonb_build_object('joined', n, 'clinic_id', last_clinic);
END $$;

REVOKE EXECUTE ON FUNCTION public.hc_create_team_invite(uuid,text,text,text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.hc_list_team_invites(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.hc_cancel_team_invite(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.hc_claim_team_invites() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_create_team_invite(uuid,text,text,text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.hc_list_team_invites(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.hc_cancel_team_invite(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.hc_claim_team_invites() TO authenticated, service_role;

-- ---------- Team messages ----------
CREATE TABLE public.hc_team_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_email text,
  recipient_id uuid,
  patient_id uuid REFERENCES public.hc_pilot_patients(id) ON DELETE SET NULL,
  body text NOT NULL,
  alerted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.hc_team_messages TO authenticated;
GRANT ALL ON public.hc_team_messages TO service_role;
ALTER TABLE public.hc_team_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read their team messages" ON public.hc_team_messages FOR SELECT TO authenticated
  USING (public.hc_is_member(clinic_id) AND (recipient_id IS NULL OR recipient_id = auth.uid() OR sender_id = auth.uid()));
CREATE POLICY "Members send team messages" ON public.hc_team_messages FOR INSERT TO authenticated
  WITH CHECK (public.hc_is_member(clinic_id) AND sender_id = auth.uid());
CREATE INDEX hc_team_messages_clinic_time ON public.hc_team_messages (clinic_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.hc_team_messages_validate()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE recent int;
BEGIN
  NEW.body := trim(coalesce(NEW.body,''));
  IF length(NEW.body) < 1 OR length(NEW.body) > 1000 THEN RAISE EXCEPTION 'Messages must be 1 to 1,000 characters'; END IF;
  IF NEW.body ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  IF NEW.recipient_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id = NEW.clinic_id AND user_id = NEW.recipient_id) THEN
    RAISE EXCEPTION 'That person is not on this clinic team'; END IF;
  IF NEW.patient_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.hc_pilot_patients WHERE id = NEW.patient_id AND clinic_id = NEW.clinic_id AND NOT is_real) THEN
    RAISE EXCEPTION 'Team messages can only mention test patients'; END IF;
  SELECT count(*) INTO recent FROM public.hc_team_messages WHERE sender_id = NEW.sender_id AND created_at > now() - interval '1 hour';
  IF recent >= 60 THEN RAISE EXCEPTION 'Message limit reached. Please wait a few minutes'; END IF;
  NEW.sender_email := (SELECT email FROM public.hc_members WHERE clinic_id = NEW.clinic_id AND user_id = NEW.sender_id LIMIT 1);
  NEW.alerted_at := NULL;
  NEW.created_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_team_messages_validate BEFORE INSERT ON public.hc_team_messages FOR EACH ROW EXECUTE FUNCTION public.hc_team_messages_validate();

CREATE TABLE public.hc_team_message_reads (
  message_id uuid NOT NULL REFERENCES public.hc_team_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);
GRANT SELECT, INSERT ON public.hc_team_message_reads TO authenticated;
GRANT ALL ON public.hc_team_message_reads TO service_role;
ALTER TABLE public.hc_team_message_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "People read their own read marks" ON public.hc_team_message_reads FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "People mark messages they can see" ON public.hc_team_message_reads FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.hc_team_messages m WHERE m.id = message_id AND public.hc_is_member(m.clinic_id) AND (m.recipient_id IS NULL OR m.recipient_id = auth.uid() OR m.sender_id = auth.uid())));

-- Server-only throttle for "new message" email alerts.
CREATE TABLE public.hc_team_alert_log (
  user_id uuid PRIMARY KEY,
  last_sent_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.hc_team_alert_log TO service_role;
ALTER TABLE public.hc_team_alert_log ENABLE ROW LEVEL SECURITY;