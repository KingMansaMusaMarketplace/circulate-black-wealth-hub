-- Pilot test-patient storage for 1325 Clinical. Test patients only until BAAs + attorney approval.
CREATE TABLE public.hc_pilot_patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  sex text,
  phone text,
  allergies text[] NOT NULL DEFAULT '{}',
  conditions text[] NOT NULL DEFAULT '{}',
  test_patient_confirmed boolean NOT NULL DEFAULT false,
  archived_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_patients_clinic_idx ON public.hc_pilot_patients(clinic_id, last_name);

CREATE TABLE public.hc_pilot_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  recorded_on date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL,
  details text,
  bp_sys integer, bp_dia integer, heart_rate integer, weight_lb numeric, temperature_f numeric,
  medication_name text, dose text,
  status text NOT NULL DEFAULT 'active',
  error_reason text,
  author_email text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_records_patient_idx ON public.hc_pilot_records(patient_id, recorded_on DESC);

CREATE TABLE public.hc_pilot_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid,
  record_id uuid,
  actor uuid,
  actor_email text,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_audit_clinic_idx ON public.hc_pilot_audit(clinic_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_patients TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_records TO authenticated;
GRANT SELECT ON public.hc_pilot_audit TO authenticated;
GRANT ALL ON public.hc_pilot_patients, public.hc_pilot_records, public.hc_pilot_audit TO service_role;

ALTER TABLE public.hc_pilot_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_pilot_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_pilot_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinic members read pilot patients" ON public.hc_pilot_patients FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE POLICY "Clinic members add pilot patients" ON public.hc_pilot_patients FOR INSERT TO authenticated WITH CHECK (public.hc_is_member(clinic_id) AND created_by = auth.uid());
CREATE POLICY "Clinic members update pilot patients" ON public.hc_pilot_patients FOR UPDATE TO authenticated USING (public.hc_is_member(clinic_id)) WITH CHECK (public.hc_is_member(clinic_id));

CREATE POLICY "Clinic members read pilot records" ON public.hc_pilot_records FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE POLICY "Clinic members add pilot records" ON public.hc_pilot_records FOR INSERT TO authenticated WITH CHECK (public.hc_is_member(clinic_id) AND created_by = auth.uid());
CREATE POLICY "Clinic members correct pilot records" ON public.hc_pilot_records FOR UPDATE TO authenticated USING (public.hc_is_member(clinic_id)) WITH CHECK (public.hc_is_member(clinic_id));

CREATE POLICY "Clinic owners read pilot activity" ON public.hc_pilot_audit FOR SELECT TO authenticated USING (public.hc_is_owner(clinic_id));

-- Validation (triggers, not CHECK constraints)
CREATE OR REPLACE FUNCTION public.hc_pilot_patients_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE all_text text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.clinic_id := OLD.clinic_id; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
    NEW.test_patient_confirmed := OLD.test_patient_confirmed;
  END IF;
  IF NEW.test_patient_confirmed IS NOT TRUE THEN
    RAISE EXCEPTION 'Pilot patients must be confirmed as made-up test patients, not real people';
  END IF;
  NEW.first_name := trim(NEW.first_name); NEW.last_name := trim(NEW.last_name);
  IF length(NEW.first_name) < 1 OR length(NEW.first_name) > 80 OR length(NEW.last_name) < 1 OR length(NEW.last_name) > 80 THEN
    RAISE EXCEPTION 'First and last name are required (80 characters max)';
  END IF;
  IF NEW.date_of_birth IS NOT NULL AND (NEW.date_of_birth > CURRENT_DATE OR NEW.date_of_birth < DATE '1900-01-01') THEN
    RAISE EXCEPTION 'Date of birth must be between 1900 and today';
  END IF;
  IF NEW.sex IS NOT NULL AND NEW.sex NOT IN ('female','male','other','unknown') THEN RAISE EXCEPTION 'Invalid sex value'; END IF;
  IF NEW.phone IS NOT NULL AND length(NEW.phone) > 30 THEN RAISE EXCEPTION 'Phone is too long'; END IF;
  IF coalesce(array_length(NEW.allergies,1),0) > 30 OR coalesce(array_length(NEW.conditions,1),0) > 30 THEN RAISE EXCEPTION 'Too many list items'; END IF;
  all_text := concat_ws(' ', NEW.first_name, NEW.last_name, NEW.phone, array_to_string(NEW.allergies,' '), array_to_string(NEW.conditions,' '));
  IF all_text ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.updated_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_patients_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_patients FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_patients_validate();

CREATE OR REPLACE FUNCTION public.hc_pilot_records_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE pclinic uuid;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Records are never rewritten: only marking "entered in error" with a reason is allowed.
    IF OLD.status = 'entered_in_error' THEN RAISE EXCEPTION 'This record is already marked as entered in error'; END IF;
    IF NEW.status <> 'entered_in_error' OR coalesce(length(trim(NEW.error_reason)),0) < 3 THEN
      RAISE EXCEPTION 'Records can only be marked as entered in error, with a reason';
    END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.record_type := OLD.record_type;
    NEW.recorded_on := OLD.recorded_on; NEW.title := OLD.title; NEW.details := OLD.details;
    NEW.bp_sys := OLD.bp_sys; NEW.bp_dia := OLD.bp_dia; NEW.heart_rate := OLD.heart_rate; NEW.weight_lb := OLD.weight_lb;
    NEW.temperature_f := OLD.temperature_f; NEW.medication_name := OLD.medication_name; NEW.dose := OLD.dose;
    NEW.author_email := OLD.author_email; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
    NEW.error_reason := left(trim(NEW.error_reason), 300);
    NEW.updated_by := auth.uid(); NEW.updated_at := now();
    RETURN NEW;
  END IF;
  SELECT clinic_id INTO pclinic FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  IF NEW.record_type NOT IN ('visit_note','vitals','medication','allergy','problem','lab_result') THEN RAISE EXCEPTION 'Invalid record type'; END IF;
  NEW.status := 'active'; NEW.error_reason := NULL;
  NEW.title := trim(NEW.title);
  IF length(NEW.title) < 2 OR length(NEW.title) > 140 THEN RAISE EXCEPTION 'Title is required (140 characters max)'; END IF;
  IF NEW.details IS NOT NULL AND length(NEW.details) > 5000 THEN RAISE EXCEPTION 'Details are too long (5,000 characters max)'; END IF;
  IF NEW.recorded_on > CURRENT_DATE + 1 OR NEW.recorded_on < DATE '1900-01-01' THEN RAISE EXCEPTION 'Record date must not be in the future'; END IF;
  IF concat_ws(' ', NEW.title, NEW.details, NEW.medication_name, NEW.dose) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  IF NEW.bp_sys IS NOT NULL AND (NEW.bp_sys < 50 OR NEW.bp_sys > 300) THEN RAISE EXCEPTION 'Systolic blood pressure must be 50-300'; END IF;
  IF NEW.bp_dia IS NOT NULL AND (NEW.bp_dia < 20 OR NEW.bp_dia > 200) THEN RAISE EXCEPTION 'Diastolic blood pressure must be 20-200'; END IF;
  IF NEW.heart_rate IS NOT NULL AND (NEW.heart_rate < 20 OR NEW.heart_rate > 250) THEN RAISE EXCEPTION 'Heart rate must be 20-250'; END IF;
  IF NEW.weight_lb IS NOT NULL AND (NEW.weight_lb < 1 OR NEW.weight_lb > 1000) THEN RAISE EXCEPTION 'Weight must be 1-1000 lb'; END IF;
  IF NEW.temperature_f IS NOT NULL AND (NEW.temperature_f < 85 OR NEW.temperature_f > 115) THEN RAISE EXCEPTION 'Temperature must be 85-115 F'; END IF;
  IF NEW.record_type = 'medication' AND coalesce(length(trim(NEW.medication_name)),0) < 2 THEN RAISE EXCEPTION 'Medication name is required'; END IF;
  NEW.author_email := (SELECT email FROM auth.users WHERE id = auth.uid());
  NEW.created_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_records_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_records FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_records_validate();

-- Activity log written automatically
CREATE OR REPLACE FUNCTION public.hc_pilot_audit_write()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE act text;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_patients' THEN
    act := CASE WHEN TG_OP = 'INSERT' THEN 'patient_created'
                WHEN NEW.archived_at IS NOT NULL AND OLD.archived_at IS NULL THEN 'patient_archived'
                ELSE 'patient_updated' END;
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
    VALUES (NEW.clinic_id, NEW.id, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), act);
  ELSE
    act := CASE WHEN TG_OP = 'INSERT' THEN 'record_added' ELSE 'record_marked_error' END;
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, record_id, actor, actor_email, action)
    VALUES (NEW.clinic_id, NEW.patient_id, NEW.id, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), act);
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.hc_pilot_audit_write() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER hc_pilot_patients_audit AFTER INSERT OR UPDATE ON public.hc_pilot_patients FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_audit_write();
CREATE TRIGGER hc_pilot_records_audit AFTER INSERT OR UPDATE ON public.hc_pilot_records FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_audit_write();

-- Chart-open logging (who looked at which chart)
CREATE OR REPLACE FUNCTION public.hc_pilot_log_chart_view(_patient uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT clinic_id INTO c FROM public.hc_pilot_patients WHERE id = _patient;
  IF c IS NULL OR NOT public.hc_is_member(c) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
  VALUES (c, _patient, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), 'chart_opened');
END $$;
REVOKE ALL ON FUNCTION public.hc_pilot_log_chart_view(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_pilot_log_chart_view(uuid) TO authenticated;