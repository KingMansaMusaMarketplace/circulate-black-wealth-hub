-- ===================== Phase 2 pilot tables =====================

-- ---------- Appointments ----------
CREATE TABLE public.hc_pilot_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL,
  provider_email text,
  starts_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 20,
  visit_type text NOT NULL DEFAULT 'follow_up',
  reason text,
  status text NOT NULL DEFAULT 'scheduled',
  status_reason text,
  checked_in_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_by_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_appointments TO authenticated;
GRANT ALL ON public.hc_pilot_appointments TO service_role;
ALTER TABLE public.hc_pilot_appointments ENABLE ROW LEVEL SECURITY;
CREATE INDEX hc_pilot_appointments_day ON public.hc_pilot_appointments (clinic_id, starts_at);
CREATE INDEX hc_pilot_appointments_provider ON public.hc_pilot_appointments (provider_id, starts_at);
CREATE INDEX hc_pilot_appointments_patient ON public.hc_pilot_appointments (patient_id, starts_at);

-- ---------- Patient portal links ----------
CREATE TABLE public.hc_pilot_portal_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  email text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  invited_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE (patient_id, user_id)
);
GRANT SELECT ON public.hc_pilot_portal_links TO authenticated;
GRANT ALL ON public.hc_pilot_portal_links TO service_role;
ALTER TABLE public.hc_pilot_portal_links ENABLE ROW LEVEL SECURITY;
CREATE INDEX hc_pilot_portal_links_user ON public.hc_pilot_portal_links (user_id) WHERE active;

-- ---------- Portal messages ----------
CREATE TABLE public.hc_pilot_portal_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  sender_kind text NOT NULL,
  topic text NOT NULL DEFAULT 'question',
  body text NOT NULL,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  sender_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_by_clinic_at timestamptz,
  read_by_patient_at timestamptz
);
GRANT SELECT, INSERT ON public.hc_pilot_portal_messages TO authenticated;
GRANT ALL ON public.hc_pilot_portal_messages TO service_role;
ALTER TABLE public.hc_pilot_portal_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX hc_pilot_portal_messages_thread ON public.hc_pilot_portal_messages (clinic_id, patient_id, created_at);

-- ---------- Practice claims ----------
CREATE TABLE public.hc_pilot_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  visit_note_id uuid NOT NULL REFERENCES public.hc_pilot_visit_notes(id) ON DELETE CASCADE,
  service_date date NOT NULL,
  payer_name text NOT NULL DEFAULT 'Self-pay',
  member_id text,
  diagnosis_codes text[] NOT NULL DEFAULT '{}',
  lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  paid_cents bigint,
  denial_reason text,
  void_reason text,
  submitted_at timestamptz,
  closed_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_by_email text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_claims TO authenticated;
GRANT ALL ON public.hc_pilot_claims TO service_role;
ALTER TABLE public.hc_pilot_claims ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX hc_pilot_claims_one_per_visit ON public.hc_pilot_claims (visit_note_id) WHERE status <> 'void';
CREATE INDEX hc_pilot_claims_clinic ON public.hc_pilot_claims (clinic_id, service_date DESC);

-- ===================== Portal helper =====================
CREATE OR REPLACE FUNCTION public.hc_portal_patient(_patient uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT auth.uid() IS NOT NULL AND clinical_private.hc_has_preview_access() AND EXISTS (
    SELECT 1 FROM public.hc_pilot_portal_links l
    JOIN public.hc_pilot_patients p ON p.id = l.patient_id
    WHERE l.patient_id = _patient AND l.user_id = auth.uid() AND l.active AND NOT coalesce(p.is_real, false))
$$;

-- ===================== Policies =====================
CREATE POLICY "Members or portal patient read pilot appointments" ON public.hc_pilot_appointments FOR SELECT TO authenticated
  USING (public.hc_is_member(clinic_id) OR public.hc_portal_patient(patient_id));
CREATE POLICY "Scheduling staff book pilot appointments" ON public.hc_pilot_appointments FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']) AND created_by = auth.uid());
CREATE POLICY "Scheduling staff update pilot appointments" ON public.hc_pilot_appointments FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']));

CREATE POLICY "Care team or linked tester read portal links" ON public.hc_pilot_portal_links FOR SELECT TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk'])
         OR (user_id = auth.uid() AND clinical_private.hc_has_preview_access()));

CREATE POLICY "Care team or portal patient read portal messages" ON public.hc_pilot_portal_messages FOR SELECT TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']) OR public.hc_portal_patient(patient_id));
CREATE POLICY "Care team or portal patient send portal messages" ON public.hc_pilot_portal_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND (
    (sender_kind = 'clinic' AND public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']))
    OR (sender_kind = 'patient' AND public.hc_portal_patient(patient_id))));

CREATE POLICY "Doctors and billers read practice claims" ON public.hc_pilot_claims FOR SELECT TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','biller']));
CREATE POLICY "Doctors and billers start practice claims" ON public.hc_pilot_claims FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','biller']) AND created_by = auth.uid());
CREATE POLICY "Doctors and billers work practice claims" ON public.hc_pilot_claims FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','biller']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','biller']));

-- Portal testers read only their own linked test patient.
CREATE POLICY "Portal patient reads own test patient" ON public.hc_pilot_patients FOR SELECT TO authenticated
  USING (public.hc_portal_patient(id));
CREATE POLICY "Portal patient reads own records" ON public.hc_pilot_records FOR SELECT TO authenticated
  USING (status <> 'entered_in_error' AND public.hc_portal_patient(patient_id));
CREATE POLICY "Portal patient reads own signed notes" ON public.hc_pilot_visit_notes FOR SELECT TO authenticated
  USING (status = 'signed' AND public.hc_portal_patient(patient_id));
CREATE POLICY "Portal patient reads own prescriptions" ON public.hc_pilot_prescriptions FOR SELECT TO authenticated
  USING (status <> 'entered_in_error' AND public.hc_portal_patient(patient_id));

-- ===================== Appointment rules =====================
CREATE OR REPLACE FUNCTION public.hc_pilot_appointments_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pclinic uuid; prole text; pemail text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('completed','cancelled','no_show') THEN RAISE EXCEPTION 'This appointment is already closed'; END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.created_by := OLD.created_by;
    NEW.created_by_email := OLD.created_by_email; NEW.created_at := OLD.created_at; NEW.updated_at := now();
    IF NEW.status = 'scheduled' AND OLD.status = 'scheduled' THEN
      NEW.checked_in_at := NULL; NEW.status_reason := OLD.status_reason;
      -- falls through to the shared checks below (reschedule / edit)
    ELSE
      IF NEW.status = 'checked_in' AND OLD.status = 'scheduled' THEN
        NEW.checked_in_at := now(); NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'completed' AND OLD.status = 'checked_in' THEN
        NEW.checked_in_at := OLD.checked_in_at; NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'no_show' AND OLD.status = 'scheduled' THEN
        NEW.checked_in_at := OLD.checked_in_at; NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'cancelled' AND OLD.status IN ('scheduled','checked_in') THEN
        IF coalesce(length(trim(NEW.status_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for cancelling (at least 3 characters)'; END IF;
        IF NEW.status_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
        NEW.status_reason := left(trim(NEW.status_reason), 300); NEW.checked_in_at := OLD.checked_in_at;
      ELSE
        RAISE EXCEPTION 'An appointment moves from booked to checked in to done, or is cancelled or marked no-show';
      END IF;
      NEW.starts_at := OLD.starts_at; NEW.duration_min := OLD.duration_min; NEW.provider_id := OLD.provider_id;
      NEW.provider_email := OLD.provider_email; NEW.visit_type := OLD.visit_type; NEW.reason := OLD.reason;
      RETURN NEW;
    END IF;
  ELSE
    SELECT clinic_id INTO pclinic FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
    IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
    IF NEW.starts_at < now() - interval '1 day' THEN RAISE EXCEPTION 'Appointments can''t be booked more than a day in the past'; END IF;
    NEW.status := 'scheduled'; NEW.checked_in_at := NULL; NEW.status_reason := NULL;
    NEW.created_by := auth.uid(); NEW.created_by_email := nullif(auth.jwt() ->> 'email', '');
    NEW.created_at := now(); NEW.updated_at := now();
  END IF;
  IF NEW.starts_at IS NULL OR NEW.starts_at > now() + interval '400 days' THEN RAISE EXCEPTION 'Choose a date within the next 13 months'; END IF;
  IF NEW.duration_min IS NULL OR NEW.duration_min < 5 OR NEW.duration_min > 240 THEN RAISE EXCEPTION 'Length must be 5 to 240 minutes'; END IF;
  IF NEW.visit_type NOT IN ('new_patient','follow_up','annual','urgent','telehealth','procedure') THEN RAISE EXCEPTION 'Choose a visit type'; END IF;
  NEW.reason := nullif(trim(coalesce(NEW.reason, '')), '');
  IF length(coalesce(NEW.reason, '')) > 300 THEN RAISE EXCEPTION 'Reason is too long (300 characters max)'; END IF;
  IF coalesce(NEW.reason, '') ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  SELECT role, email INTO prole, pemail FROM public.hc_members WHERE clinic_id = NEW.clinic_id AND user_id = NEW.provider_id;
  IF prole IS NULL OR prole NOT IN ('owner','doctor','nurse') THEN RAISE EXCEPTION 'Choose a doctor or nurse from this clinic''s team'; END IF;
  NEW.provider_email := pemail;
  PERFORM pg_advisory_xact_lock(hashtext('hc_pilot_appt:' || NEW.provider_id::text));
  IF EXISTS (
    SELECT 1 FROM public.hc_pilot_appointments a
    WHERE a.clinic_id = NEW.clinic_id AND a.provider_id = NEW.provider_id AND a.id <> NEW.id AND a.status IN ('scheduled','checked_in')
      AND tstzrange(a.starts_at, a.starts_at + make_interval(mins => a.duration_min))
       && tstzrange(NEW.starts_at, NEW.starts_at + make_interval(mins => NEW.duration_min))
  ) THEN
    RAISE EXCEPTION 'That time overlaps another appointment for this provider';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_appointments_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_appointments
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_appointments_validate();
CREATE TRIGGER hc_pilot_appointments_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_appointments
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

-- ===================== Portal message rules =====================
CREATE OR REPLACE FUNCTION public.hc_pilot_portal_messages_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pclinic uuid; isreal boolean;
BEGIN
  SELECT clinic_id, is_real INTO pclinic, isreal FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  IF coalesce(isreal, false) THEN RAISE EXCEPTION 'The patient portal is for test patients only until go-live review'; END IF;
  IF NEW.sender_kind NOT IN ('patient','clinic') THEN RAISE EXCEPTION 'Unknown sender'; END IF;
  IF NEW.topic NOT IN ('question','appointment_request','refill_request','reply') THEN RAISE EXCEPTION 'Choose a message topic'; END IF;
  NEW.body := trim(coalesce(NEW.body, ''));
  IF length(NEW.body) < 1 OR length(NEW.body) > 2000 THEN RAISE EXCEPTION 'Messages must be 1 to 2,000 characters'; END IF;
  IF NEW.body ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.sender_id := auth.uid(); NEW.sender_email := nullif(auth.jwt() ->> 'email', '');
  NEW.created_at := now(); NEW.read_by_clinic_at := NULL; NEW.read_by_patient_at := NULL;
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_portal_messages_validate BEFORE INSERT ON public.hc_pilot_portal_messages
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_portal_messages_validate();

CREATE OR REPLACE FUNCTION public.hc_pilot_portal_invite(_patient uuid, _email text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE c uuid; isreal boolean; target uuid; e text := lower(trim(coalesce(_email, '')));
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT clinic_id, is_real INTO c, isreal FROM public.hc_pilot_patients WHERE id = _patient;
  IF c IS NULL OR NOT public.hc_has_clinic_role(c, ARRAY['owner','doctor','nurse','front_desk']) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF coalesce(isreal, false) THEN RAISE EXCEPTION 'The patient portal is for test patients only until go-live review'; END IF;
  IF e !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' OR length(e) > 254 THEN RAISE EXCEPTION 'Enter a valid email address'; END IF;
  SELECT id INTO target FROM auth.users WHERE lower(email) = e LIMIT 1;
  IF target IS NULL THEN RETURN 'not_found'; END IF;
  INSERT INTO public.hc_pilot_portal_links(clinic_id, patient_id, user_id, email, invited_by)
  VALUES (c, _patient, target, e, auth.uid())
  ON CONFLICT (patient_id, user_id) DO UPDATE SET active = true, revoked_at = NULL, invited_by = EXCLUDED.invited_by;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
  VALUES (c, _patient, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'portal_invited');
  RETURN 'linked';
END $$;

CREATE OR REPLACE FUNCTION public.hc_pilot_portal_revoke(_link uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE l record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO l FROM public.hc_pilot_portal_links WHERE id = _link;
  IF l.id IS NULL OR NOT public.hc_has_clinic_role(l.clinic_id, ARRAY['owner','doctor','nurse','front_desk']) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.hc_pilot_portal_links SET active = false, revoked_at = now() WHERE id = _link AND active;
  IF FOUND THEN
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
    VALUES (l.clinic_id, l.patient_id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'portal_revoked');
  END IF;
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.hc_pilot_portal_mark_read(_patient uuid, _side text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE c uuid; n integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT clinic_id INTO c FROM public.hc_pilot_patients WHERE id = _patient;
  IF c IS NULL THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF _side = 'clinic' AND public.hc_has_clinic_role(c, ARRAY['owner','doctor','nurse','front_desk']) THEN
    UPDATE public.hc_pilot_portal_messages SET read_by_clinic_at = now()
    WHERE patient_id = _patient AND sender_kind = 'patient' AND read_by_clinic_at IS NULL;
    GET DIAGNOSTICS n = ROW_COUNT;
  ELSIF _side = 'patient' AND public.hc_portal_patient(_patient) THEN
    UPDATE public.hc_pilot_portal_messages SET read_by_patient_at = now()
    WHERE patient_id = _patient AND sender_kind = 'clinic' AND read_by_patient_at IS NULL;
    GET DIAGNOSTICS n = ROW_COUNT;
  ELSE
    RAISE EXCEPTION 'Not allowed';
  END IF;
  RETURN n;
END $$;

CREATE OR REPLACE FUNCTION public.hc_portal_my_patients()
RETURNS TABLE(patient_id uuid, clinic_id uuid, clinic_name text, first_name text, last_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT p.id, p.clinic_id, c.name, p.first_name, p.last_name
  FROM public.hc_pilot_portal_links l
  JOIN public.hc_pilot_patients p ON p.id = l.patient_id
  JOIN public.hc_clinics c ON c.id = p.clinic_id
  WHERE auth.uid() IS NOT NULL AND clinical_private.hc_has_preview_access()
    AND l.user_id = auth.uid() AND l.active AND NOT coalesce(p.is_real, false) AND p.archived_at IS NULL
  ORDER BY c.name, p.last_name
$$;

-- ===================== Practice claim rules =====================
CREATE OR REPLACE FUNCTION public.hc_pilot_claims_validate()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE n record; d text; l jsonb; outl jsonb := '[]'::jsonb; total bigint := 0; code text; modi text;
  units integer; charge bigint; ptrs jsonb; p jsonb; ndx integer; editing boolean := false;
BEGIN
  IF NOT public.hc_has_clinic_role(NEW.clinic_id, ARRAY['owner','doctor','biller']) THEN
    RAISE EXCEPTION 'Only a doctor or biller can work on practice claims';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('practice_paid','void') THEN RAISE EXCEPTION 'This practice claim is closed'; END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.visit_note_id := OLD.visit_note_id;
    NEW.service_date := OLD.service_date; NEW.created_by := OLD.created_by; NEW.created_by_email := OLD.created_by_email;
    NEW.created_at := OLD.created_at; NEW.updated_by := auth.uid(); NEW.updated_at := now();
    NEW.void_reason := CASE WHEN NEW.status = 'void' THEN NEW.void_reason ELSE OLD.void_reason END;
    IF NEW.status = 'void' THEN
      IF coalesce(length(trim(NEW.void_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for voiding (at least 3 characters)'; END IF;
      IF NEW.void_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
      NEW.void_reason := left(trim(NEW.void_reason), 300);
      NEW.diagnosis_codes := OLD.diagnosis_codes; NEW.lines := OLD.lines; NEW.total_cents := OLD.total_cents;
      NEW.payer_name := OLD.payer_name; NEW.member_id := OLD.member_id; NEW.paid_cents := OLD.paid_cents;
      NEW.denial_reason := OLD.denial_reason; NEW.submitted_at := OLD.submitted_at; NEW.closed_at := now();
      RETURN NEW;
    END IF;
    IF OLD.status = 'draft' AND NEW.status IN ('draft','ready') THEN
      editing := true;
      NEW.paid_cents := OLD.paid_cents; NEW.denial_reason := OLD.denial_reason;
      NEW.submitted_at := OLD.submitted_at; NEW.closed_at := OLD.closed_at;
    ELSE
      NEW.diagnosis_codes := OLD.diagnosis_codes; NEW.lines := OLD.lines; NEW.total_cents := OLD.total_cents;
      NEW.payer_name := OLD.payer_name; NEW.member_id := OLD.member_id;
      IF OLD.status = 'ready' AND NEW.status = 'draft' THEN
        NEW.paid_cents := OLD.paid_cents; NEW.denial_reason := OLD.denial_reason; NEW.submitted_at := OLD.submitted_at; NEW.closed_at := OLD.closed_at;
      ELSIF OLD.status = 'ready' AND NEW.status = 'practice_submitted' THEN
        NEW.paid_cents := NULL; NEW.denial_reason := OLD.denial_reason; NEW.submitted_at := now(); NEW.closed_at := NULL;
      ELSIF OLD.status = 'practice_submitted' AND NEW.status = 'practice_paid' THEN
        IF NEW.paid_cents IS NULL OR NEW.paid_cents < 0 OR NEW.paid_cents > OLD.total_cents THEN
          RAISE EXCEPTION 'Paid amount must be between $0 and the claim total';
        END IF;
        NEW.denial_reason := OLD.denial_reason; NEW.submitted_at := OLD.submitted_at; NEW.closed_at := now();
      ELSIF OLD.status = 'practice_submitted' AND NEW.status = 'practice_denied' THEN
        IF coalesce(length(trim(NEW.denial_reason)),0) < 3 THEN RAISE EXCEPTION 'Give the denial reason (at least 3 characters)'; END IF;
        IF NEW.denial_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
        NEW.denial_reason := left(trim(NEW.denial_reason), 300);
        NEW.paid_cents := NULL; NEW.submitted_at := OLD.submitted_at; NEW.closed_at := NULL;
      ELSIF OLD.status = 'practice_denied' AND NEW.status = 'draft' THEN
        NEW.paid_cents := NULL; NEW.denial_reason := OLD.denial_reason; NEW.submitted_at := NULL; NEW.closed_at := NULL;
      ELSE
        RAISE EXCEPTION 'That claim step isn''t allowed';
      END IF;
      RETURN NEW;
    END IF;
  ELSE
    SELECT patient_id, clinic_id, status, visit_date INTO n FROM public.hc_pilot_visit_notes WHERE id = NEW.visit_note_id;
    IF n.patient_id IS DISTINCT FROM NEW.patient_id OR n.clinic_id IS DISTINCT FROM NEW.clinic_id THEN
      RAISE EXCEPTION 'Choose a visit from this patient''s chart';
    END IF;
    IF n.status <> 'signed' THEN RAISE EXCEPTION 'Only a signed visit note can be billed'; END IF;
    NEW.service_date := n.visit_date; NEW.status := 'draft'; NEW.paid_cents := NULL; NEW.denial_reason := NULL;
    NEW.void_reason := NULL; NEW.submitted_at := NULL; NEW.closed_at := NULL;
    NEW.created_by := auth.uid(); NEW.created_by_email := nullif(auth.jwt() ->> 'email', '');
    NEW.updated_by := auth.uid(); NEW.created_at := now(); NEW.updated_at := now();
    editing := true;
  END IF;

  IF editing THEN
    NEW.payer_name := trim(coalesce(NEW.payer_name, ''));
    IF length(NEW.payer_name) < 2 OR length(NEW.payer_name) > 120 THEN RAISE EXCEPTION 'Payer name is required (120 characters max)'; END IF;
    NEW.member_id := nullif(trim(coalesce(NEW.member_id, '')), '');
    IF length(coalesce(NEW.member_id, '')) > 40 THEN RAISE EXCEPTION 'Member ID is too long (40 characters max)'; END IF;
    IF concat_ws(' ', NEW.payer_name, NEW.member_id) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
    NEW.diagnosis_codes := ARRAY(SELECT upper(trim(x)) FROM unnest(coalesce(NEW.diagnosis_codes, '{}')) WITH ORDINALITY AS t(x, i) WHERE trim(x) <> '' ORDER BY i);
    IF coalesce(array_length(NEW.diagnosis_codes, 1), 0) > 12 THEN RAISE EXCEPTION 'A claim can list up to 12 diagnosis codes'; END IF;
    IF (SELECT count(DISTINCT x) FROM unnest(NEW.diagnosis_codes) x) <> coalesce(array_length(NEW.diagnosis_codes, 1), 0) THEN
      RAISE EXCEPTION 'List each diagnosis code only once';
    END IF;
    FOREACH d IN ARRAY NEW.diagnosis_codes LOOP
      IF d !~ '^[A-TV-Z][0-9][0-9A-Z](\.[0-9A-Z]{1,4})?$' THEN
        RAISE EXCEPTION 'Diagnosis code % doesn''t look like an ICD-10 code (for example E11.9)', d;
      END IF;
    END LOOP;
    IF jsonb_typeof(NEW.lines) <> 'array' THEN RAISE EXCEPTION 'Charge lines are required'; END IF;
    IF jsonb_array_length(NEW.lines) > 12 THEN RAISE EXCEPTION 'A claim can have up to 12 charge lines'; END IF;
    FOR l IN SELECT value FROM jsonb_array_elements(NEW.lines) LOOP
      IF jsonb_typeof(l) <> 'object' THEN RAISE EXCEPTION 'Each charge line needs a code, units and a charge'; END IF;
      code := upper(trim(coalesce(l ->> 'code', '')));
      IF code !~ '^([0-9]{4}[0-9A-Z]|[A-V][0-9]{4})$' THEN
        RAISE EXCEPTION 'Procedure code % doesn''t look like a CPT or HCPCS code (for example 99213)', nullif(code, '');
      END IF;
      modi := nullif(upper(trim(coalesce(l ->> 'modifier', ''))), '');
      IF modi IS NOT NULL AND modi !~ '^[0-9A-Z]{2}$' THEN RAISE EXCEPTION 'Modifiers are 2 letters or numbers (for example 25)'; END IF;
      IF jsonb_typeof(l -> 'units') <> 'number' OR jsonb_typeof(l -> 'charge_cents') <> 'number' THEN
        RAISE EXCEPTION 'Each charge line needs units and a charge';
      END IF;
      units := (l ->> 'units')::numeric::integer; charge := (l ->> 'charge_cents')::numeric::bigint;
      IF units < 1 OR units > 99 THEN RAISE EXCEPTION 'Units must be 1 to 99'; END IF;
      IF charge < 0 OR charge > 10000000 THEN RAISE EXCEPTION 'Each charge must be between $0 and $100,000'; END IF;
      ptrs := coalesce(l -> 'dx_pointers', '[]'::jsonb);
      IF jsonb_typeof(ptrs) <> 'array' OR jsonb_array_length(ptrs) < 1 OR jsonb_array_length(ptrs) > 4 THEN
        RAISE EXCEPTION 'Link each charge line to 1 to 4 diagnosis codes';
      END IF;
      FOR p IN SELECT value FROM jsonb_array_elements(ptrs) LOOP
        IF jsonb_typeof(p) <> 'number' THEN RAISE EXCEPTION 'Diagnosis links must point to listed codes'; END IF;
        ndx := (p #>> '{}')::numeric::integer;
        IF ndx < 1 OR ndx > coalesce(array_length(NEW.diagnosis_codes, 1), 0) THEN RAISE EXCEPTION 'Diagnosis links must point to listed codes'; END IF;
      END LOOP;
      total := total + units::bigint * charge;
      outl := outl || jsonb_build_array(jsonb_build_object('code', code, 'modifier', modi, 'units', units, 'charge_cents', charge, 'dx_pointers', ptrs));
    END LOOP;
    NEW.lines := outl; NEW.total_cents := total;
    IF NEW.status = 'ready' AND (coalesce(array_length(NEW.diagnosis_codes, 1), 0) = 0 OR jsonb_array_length(NEW.lines) = 0) THEN
      RAISE EXCEPTION 'Add at least one diagnosis code and one charge line before marking the claim ready';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_claims_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_claims
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_claims_validate();
CREATE TRIGGER hc_pilot_claims_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_claims
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

CREATE OR REPLACE FUNCTION public.hc_pilot_billable_visits(_clinic uuid)
RETURNS TABLE(note_id uuid, patient_id uuid, visit_date date, visit_reason text, assessment text, signer_email text, has_claim boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.hc_has_clinic_role(_clinic, ARRAY['owner','doctor','biller']) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY
    SELECT v.id, v.patient_id, v.visit_date, v.visit_reason, v.assessment, v.signer_email,
           EXISTS (SELECT 1 FROM public.hc_pilot_claims c WHERE c.visit_note_id = v.id AND c.status <> 'void')
    FROM public.hc_pilot_visit_notes v
    WHERE v.clinic_id = _clinic AND v.status = 'signed'
    ORDER BY v.visit_date DESC, v.signed_at DESC
    LIMIT 200;
END $$;

-- ===================== Activity log =====================
CREATE OR REPLACE FUNCTION public.hc_pilot_phase2_audit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE act text;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_appointments' THEN
    act := CASE WHEN TG_OP = 'INSERT' THEN 'appointment_booked'
                WHEN NEW.status <> OLD.status THEN 'appointment_' || NEW.status
                ELSE 'appointment_rescheduled' END;
  ELSIF TG_TABLE_NAME = 'hc_pilot_claims' THEN
    act := CASE WHEN TG_OP = 'INSERT' THEN 'claim_started'
                WHEN NEW.status <> OLD.status THEN 'claim_' || NEW.status
                ELSE 'claim_edited' END;
  ELSE
    act := 'portal_message_' || NEW.sender_kind;
  END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, record_id, actor, actor_email, action)
  VALUES (NEW.clinic_id, NEW.patient_id, NEW.id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), act);
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_appointments_audit AFTER INSERT OR UPDATE ON public.hc_pilot_appointments
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_phase2_audit();
CREATE TRIGGER hc_pilot_claims_audit AFTER INSERT OR UPDATE ON public.hc_pilot_claims
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_phase2_audit();
CREATE TRIGGER hc_pilot_portal_messages_audit AFTER INSERT ON public.hc_pilot_portal_messages
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_phase2_audit();

-- ===================== Function access =====================
REVOKE ALL ON FUNCTION public.hc_pilot_claims_validate(), public.hc_pilot_phase2_audit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.hc_portal_patient(uuid), public.hc_pilot_portal_invite(uuid, text), public.hc_pilot_portal_revoke(uuid),
  public.hc_pilot_portal_mark_read(uuid, text), public.hc_portal_my_patients(), public.hc_pilot_billable_visits(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_portal_patient(uuid), public.hc_pilot_portal_invite(uuid, text), public.hc_pilot_portal_revoke(uuid),
  public.hc_pilot_portal_mark_read(uuid, text), public.hc_portal_my_patients(), public.hc_pilot_billable_visits(uuid) TO authenticated, service_role;

-- ===================== Outside approvals tracker (admin only) =====================
CREATE TABLE public.hc_compliance_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text NOT NULL UNIQUE,
  title text NOT NULL,
  area text NOT NULL,
  why_it_matters text NOT NULL,
  who_issues text,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','researching','applied','in_progress','passed','blocked','not_needed_yet')),
  owner_name text,
  next_step text,
  target_date date,
  estimated_cost text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_compliance_milestones TO authenticated;
GRANT ALL ON public.hc_compliance_milestones TO service_role;
ALTER TABLE public.hc_compliance_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read approvals tracker" ON public.hc_compliance_milestones FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins add approvals tracker rows" ON public.hc_compliance_milestones FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update approvals tracker rows" ON public.hc_compliance_milestones FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.hc_compliance_milestones_touch()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at := now(); NEW.updated_by := auth.uid();
  IF TG_OP = 'UPDATE' THEN NEW.item_key := OLD.item_key; NEW.created_at := OLD.created_at; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER hc_compliance_milestones_touch BEFORE INSERT OR UPDATE ON public.hc_compliance_milestones
  FOR EACH ROW EXECUTE FUNCTION public.hc_compliance_milestones_touch();

INSERT INTO public.hc_compliance_milestones (item_key, title, area, why_it_matters, who_issues, next_step, sort_order) VALUES
('onc_certification','ONC Health IT Certification (Cures Update)','certification','Doctors need a certified EHR to get Medicare quality-program credit; most clinics will not switch without it.','An ONC-Authorized Certification Body (for example Drummond Group or SLI Compliance)','Request a testing quote and the current certification criteria checklist.',10),
('onc_patient_api','Certified patient-access FHIR API ((g)(10))','certification','Federal rules require certified EHRs to let patients and apps pull their records through a standard FHIR API.','Tested as part of ONC certification','Confirm which SMART on FHIR features the testing body will check.',20),
('surescripts','Surescripts e-prescribing network certification','e_prescribing','Needed to actually send prescriptions to pharmacies and receive refill requests and medication history.','Surescripts','Contact Surescripts about solution-provider onboarding and certification fees.',30),
('epcs','Controlled-substance e-prescribing (DEA EPCS audit)','e_prescribing','Prescribing controlled medicines electronically needs a DEA-compliant third-party audit plus doctor identity proofing and two-factor sign-in.','A DEA-qualified third-party auditor or certification body','Get audit quotes after Surescripts onboarding starts.',40),
('quest','Quest Diagnostics lab interface','labs','Lets doctors send lab orders and receive results automatically instead of typing them in.','Quest Diagnostics','Ask Quest about their EHR interface program and sandbox.',50),
('labcorp','Labcorp lab interface','labs','Same as Quest for clinics that use Labcorp.','Labcorp','Ask Labcorp about their EHR interface (Labcorp Link / HL7) onboarding.',60),
('carequality','Carequality / CommonWell record exchange','exchange','Lets clinics pull and share records with hospitals and other EHRs nationwide.','Carequality or CommonWell, usually through an implementer partner','Pick an implementer partner and request onboarding terms.',70),
('tefca','TEFCA participation through a QHIN','exchange','The national framework for health-record exchange; hospitals increasingly expect it.','A Qualified Health Information Network (QHIN)','Compare QHIN participation terms with the Carequality option.',80),
('clearinghouse','Claims clearinghouse and payer enrollment','billing','Needed to really send claims (837) and receive payments and remittances (835) from insurers.','A clearinghouse (for example Availity, Office Ally or Waystar)','Request clearinghouse vendor terms; each clinic also enrolls with its payers.',90),
('hipaa_sra','Documented HIPAA Security Risk Assessment','security','Required by the HIPAA Security Rule before handling real patient data.','Internal team with an outside HIPAA consultant','Schedule the assessment once hosting and vendor agreements are chosen.',100),
('pentest','Independent penetration test','security','Hospitals and investors ask for proof that outside experts tried to break in and the findings were fixed.','An independent security testing firm','Get quotes for an application and cloud penetration test.',110),
('soc2','SOC 2 Type II audit','security','The security report most hospitals and enterprise buyers require from software vendors.','A licensed CPA audit firm','Choose a readiness tool and auditor; Type II needs months of evidence.',120),
('hitrust','HITRUST certification (optional, hospital deals)','security','Some large health systems ask for HITRUST instead of, or in addition to, SOC 2.','HITRUST Alliance and an authorized assessor','Decide after the first hospital asks for it.',130),
('kenya_dha','Kenya DHA Section 37 digital-health certification','international','Required before connecting to Kenya''s national health exchange or serving Kenyan facilities.','Kenya Digital Health Agency','Prepare the application package from the Kenya readiness module.',140);