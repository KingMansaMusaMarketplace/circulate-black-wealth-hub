CREATE TABLE public.hc_pilot_visit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visit_reason text NOT NULL,
  subjective text,
  objective text,
  assessment text,
  plan text,
  status text NOT NULL DEFAULT 'draft',
  author_email text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  signed_at timestamptz,
  signed_by uuid,
  signer_email text,
  error_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_visit_notes_patient_idx ON public.hc_pilot_visit_notes(patient_id, visit_date DESC);
CREATE INDEX hc_pilot_visit_notes_clinic_idx ON public.hc_pilot_visit_notes(clinic_id, created_at DESC);

CREATE TABLE public.hc_pilot_note_addenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  note_id uuid NOT NULL REFERENCES public.hc_pilot_visit_notes(id) ON DELETE CASCADE,
  body text NOT NULL,
  author_email text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_note_addenda_note_idx ON public.hc_pilot_note_addenda(note_id, created_at);

ALTER TABLE public.hc_pilot_audit ADD COLUMN IF NOT EXISTS note_id uuid;

REVOKE ALL ON public.hc_pilot_visit_notes FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.hc_pilot_note_addenda FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_visit_notes TO authenticated;
GRANT SELECT, INSERT ON public.hc_pilot_note_addenda TO authenticated;
GRANT ALL ON public.hc_pilot_visit_notes TO service_role;
GRANT ALL ON public.hc_pilot_note_addenda TO service_role;

ALTER TABLE public.hc_pilot_visit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_pilot_note_addenda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinic members read pilot visit notes" ON public.hc_pilot_visit_notes
  FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE POLICY "Clinic members draft pilot visit notes" ON public.hc_pilot_visit_notes
  FOR INSERT TO authenticated WITH CHECK (public.hc_is_member(clinic_id) AND created_by = auth.uid());
CREATE POLICY "Clinic members update pilot visit notes" ON public.hc_pilot_visit_notes
  FOR UPDATE TO authenticated USING (public.hc_is_member(clinic_id)) WITH CHECK (public.hc_is_member(clinic_id));

CREATE POLICY "Clinic members read pilot note addenda" ON public.hc_pilot_note_addenda
  FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE POLICY "Clinic members add pilot note addenda" ON public.hc_pilot_note_addenda
  FOR INSERT TO authenticated WITH CHECK (public.hc_is_member(clinic_id) AND created_by = auth.uid());

CREATE OR REPLACE FUNCTION public.hc_pilot_visit_notes_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE pclinic uuid; me text := nullif(auth.jwt() ->> 'email', '');
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.created_by := OLD.created_by;
    NEW.created_at := OLD.created_at; NEW.author_email := OLD.author_email;
    IF OLD.status = 'entered_in_error' THEN RAISE EXCEPTION 'This note is already marked as entered in error'; END IF;
    IF OLD.status = 'signed' THEN
      IF NEW.status <> 'entered_in_error' OR coalesce(length(trim(NEW.error_reason)),0) < 3 THEN
        RAISE EXCEPTION 'Signed notes are locked. Add an addendum, or mark the note as entered in error with a reason';
      END IF;
      NEW.visit_date := OLD.visit_date; NEW.visit_reason := OLD.visit_reason; NEW.subjective := OLD.subjective;
      NEW.objective := OLD.objective; NEW.assessment := OLD.assessment; NEW.plan := OLD.plan;
      NEW.signed_at := OLD.signed_at; NEW.signed_by := OLD.signed_by; NEW.signer_email := OLD.signer_email;
      NEW.error_reason := left(trim(NEW.error_reason), 300);
      NEW.updated_at := now();
      RETURN NEW;
    END IF;
    -- draft
    IF OLD.created_by <> auth.uid() THEN RAISE EXCEPTION 'Only the author can edit or sign this draft'; END IF;
    IF NEW.status NOT IN ('draft','signed','entered_in_error') THEN RAISE EXCEPTION 'Invalid note status'; END IF;
    IF NEW.status = 'entered_in_error' THEN
      IF coalesce(length(trim(NEW.error_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason (at least 3 characters)'; END IF;
      NEW.error_reason := left(trim(NEW.error_reason), 300);
      NEW.signed_at := NULL; NEW.signed_by := NULL; NEW.signer_email := NULL;
      NEW.updated_at := now();
      RETURN NEW;
    END IF;
  ELSE
    SELECT clinic_id INTO pclinic FROM public.hc_pilot_patients WHERE id = NEW.patient_id AND archived_at IS NULL;
    IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
    NEW.status := 'draft';
    NEW.author_email := me; NEW.created_by := auth.uid(); NEW.created_at := now();
  END IF;

  NEW.error_reason := NULL;
  NEW.visit_reason := trim(NEW.visit_reason);
  IF length(NEW.visit_reason) < 2 OR length(NEW.visit_reason) > 140 THEN RAISE EXCEPTION 'Reason for visit is required (140 characters max)'; END IF;
  IF NEW.visit_date > CURRENT_DATE + 1 OR NEW.visit_date < DATE '1900-01-01' THEN RAISE EXCEPTION 'Visit date must not be in the future'; END IF;
  IF coalesce(length(NEW.subjective),0) > 5000 OR coalesce(length(NEW.objective),0) > 5000
     OR coalesce(length(NEW.assessment),0) > 5000 OR coalesce(length(NEW.plan),0) > 5000 THEN
    RAISE EXCEPTION 'Each note section must be 5,000 characters or fewer';
  END IF;
  IF concat_ws(' ', NEW.visit_reason, NEW.subjective, NEW.objective, NEW.assessment, NEW.plan) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN
    RAISE EXCEPTION 'Social Security numbers are not allowed';
  END IF;
  IF NEW.status = 'signed' THEN
    IF coalesce(length(trim(NEW.assessment)),0) < 2 OR coalesce(length(trim(NEW.plan)),0) < 2 THEN
      RAISE EXCEPTION 'Assessment and plan are required before signing';
    END IF;
    NEW.signed_at := now(); NEW.signed_by := auth.uid(); NEW.signer_email := me;
  ELSE
    NEW.signed_at := NULL; NEW.signed_by := NULL; NEW.signer_email := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER hc_pilot_visit_notes_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_visit_notes_validate();

CREATE OR REPLACE FUNCTION public.hc_pilot_note_addenda_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE n record;
BEGIN
  SELECT clinic_id, status INTO n FROM public.hc_pilot_visit_notes WHERE id = NEW.note_id;
  IF n.clinic_id IS NULL OR n.clinic_id <> NEW.clinic_id THEN RAISE EXCEPTION 'Note does not belong to this clinic'; END IF;
  IF n.status <> 'signed' THEN RAISE EXCEPTION 'Addenda can only be added to signed notes'; END IF;
  NEW.body := trim(NEW.body);
  IF length(NEW.body) < 3 OR length(NEW.body) > 5000 THEN RAISE EXCEPTION 'Addendum must be 3 to 5,000 characters'; END IF;
  IF NEW.body ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.author_email := nullif(auth.jwt() ->> 'email', '');
  NEW.created_by := auth.uid(); NEW.created_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER hc_pilot_note_addenda_validate BEFORE INSERT ON public.hc_pilot_note_addenda
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_note_addenda_validate();

CREATE OR REPLACE FUNCTION public.hc_pilot_note_audit_write()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE act text; pid uuid; nid uuid;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_visit_notes' THEN
    nid := NEW.id; pid := NEW.patient_id;
    act := CASE WHEN TG_OP = 'INSERT' THEN 'note_drafted'
                WHEN NEW.status = 'signed' AND OLD.status = 'draft' THEN 'note_signed'
                WHEN NEW.status = 'entered_in_error' THEN 'note_marked_error'
                ELSE 'note_draft_updated' END;
  ELSE
    nid := NEW.note_id;
    SELECT patient_id INTO pid FROM public.hc_pilot_visit_notes WHERE id = NEW.note_id;
    act := 'note_addendum_added';
  END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, note_id, actor, actor_email, action)
  VALUES (NEW.clinic_id, pid, nid, auth.uid(), nullif(auth.jwt() ->> 'email', ''), act);
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.hc_pilot_note_audit_write() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER hc_pilot_visit_notes_audit AFTER INSERT OR UPDATE ON public.hc_pilot_visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_note_audit_write();
CREATE TRIGGER hc_pilot_note_addenda_audit AFTER INSERT ON public.hc_pilot_note_addenda
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_note_audit_write();