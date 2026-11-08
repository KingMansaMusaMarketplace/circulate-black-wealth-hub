ALTER TABLE public.hc_pilot_records
  ADD COLUMN IF NOT EXISTS med_frequency text,
  ADD COLUMN IF NOT EXISTS med_route text,
  ADD COLUMN IF NOT EXISTS stopped_on date,
  ADD COLUMN IF NOT EXISTS stop_reason text,
  ADD COLUMN IF NOT EXISTS allergy_reaction text,
  ADD COLUMN IF NOT EXISTS allergy_severity text,
  ADD COLUMN IF NOT EXISTS lab_value text,
  ADD COLUMN IF NOT EXISTS lab_unit text,
  ADD COLUMN IF NOT EXISTS lab_ref_range text,
  ADD COLUMN IF NOT EXISTS lab_flag text;

CREATE OR REPLACE FUNCTION public.hc_pilot_records_validate()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE pclinic uuid; preal boolean;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'entered_in_error' THEN RAISE EXCEPTION 'This record is already marked as entered in error'; END IF;
    IF NEW.status = 'stopped' THEN
      IF OLD.record_type <> 'medication' OR OLD.status <> 'active' THEN RAISE EXCEPTION 'Only an active medicine can be stopped'; END IF;
      IF NEW.stopped_on IS NULL OR NEW.stopped_on > CURRENT_DATE + 1 OR NEW.stopped_on < OLD.recorded_on THEN
        RAISE EXCEPTION 'Stop date must be on or after the start date and not in the future';
      END IF;
      IF coalesce(length(trim(NEW.stop_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for stopping (at least 3 characters)'; END IF;
      IF NEW.stop_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
      NEW.stop_reason := left(trim(NEW.stop_reason), 300);
      NEW.error_reason := OLD.error_reason;
    ELSIF NEW.status = 'entered_in_error' AND coalesce(length(trim(NEW.error_reason)),0) >= 3 THEN
      NEW.error_reason := left(trim(NEW.error_reason), 300);
      NEW.stopped_on := OLD.stopped_on; NEW.stop_reason := OLD.stop_reason;
    ELSE
      RAISE EXCEPTION 'Records can only be marked as entered in error with a reason, or a medicine stopped';
    END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.record_type := OLD.record_type;
    NEW.recorded_on := OLD.recorded_on; NEW.title := OLD.title; NEW.details := OLD.details;
    NEW.bp_sys := OLD.bp_sys; NEW.bp_dia := OLD.bp_dia; NEW.heart_rate := OLD.heart_rate; NEW.weight_lb := OLD.weight_lb;
    NEW.temperature_f := OLD.temperature_f; NEW.medication_name := OLD.medication_name; NEW.dose := OLD.dose;
    NEW.med_frequency := OLD.med_frequency; NEW.med_route := OLD.med_route;
    NEW.allergy_reaction := OLD.allergy_reaction; NEW.allergy_severity := OLD.allergy_severity;
    NEW.lab_value := OLD.lab_value; NEW.lab_unit := OLD.lab_unit; NEW.lab_ref_range := OLD.lab_ref_range; NEW.lab_flag := OLD.lab_flag;
    NEW.author_email := OLD.author_email; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
    NEW.updated_by := auth.uid(); NEW.updated_at := now();
    RETURN NEW;
  END IF;

  SELECT clinic_id, is_real INTO pclinic, preal FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  IF NEW.record_type NOT IN ('visit_note','vitals','medication','allergy','problem','lab_result') THEN RAISE EXCEPTION 'Invalid record type'; END IF;
  NEW.status := 'active'; NEW.error_reason := NULL; NEW.stopped_on := NULL; NEW.stop_reason := NULL;
  NEW.title := trim(NEW.title);
  IF length(NEW.title) < 2 OR length(NEW.title) > 140 THEN RAISE EXCEPTION 'Title is required (140 characters max)'; END IF;
  IF NEW.details IS NOT NULL AND length(NEW.details) > 5000 THEN RAISE EXCEPTION 'Details are too long (5,000 characters max)'; END IF;
  IF NEW.recorded_on > CURRENT_DATE + 1 OR NEW.recorded_on < DATE '1900-01-01' THEN RAISE EXCEPTION 'Record date must not be in the future'; END IF;

  -- Fields only belong to their own record type.
  IF NEW.record_type <> 'medication' THEN NEW.med_frequency := NULL; NEW.med_route := NULL; END IF;
  IF NEW.record_type <> 'allergy' THEN NEW.allergy_reaction := NULL; NEW.allergy_severity := NULL; END IF;
  IF NEW.record_type <> 'lab_result' THEN NEW.lab_value := NULL; NEW.lab_unit := NULL; NEW.lab_ref_range := NULL; NEW.lab_flag := NULL; END IF;
  NEW.med_frequency := nullif(trim(NEW.med_frequency), ''); NEW.med_route := nullif(trim(NEW.med_route), '');
  NEW.allergy_reaction := nullif(trim(NEW.allergy_reaction), ''); NEW.allergy_severity := nullif(trim(NEW.allergy_severity), '');
  NEW.lab_value := nullif(trim(NEW.lab_value), ''); NEW.lab_unit := nullif(trim(NEW.lab_unit), '');
  NEW.lab_ref_range := nullif(trim(NEW.lab_ref_range), ''); NEW.lab_flag := nullif(trim(NEW.lab_flag), '');
  IF length(NEW.med_frequency) > 140 OR length(NEW.med_route) > 60 OR length(NEW.allergy_reaction) > 200
     OR length(NEW.lab_value) > 60 OR length(NEW.lab_unit) > 30 OR length(NEW.lab_ref_range) > 60 THEN
    RAISE EXCEPTION 'One of the fields is too long';
  END IF;
  IF NEW.allergy_severity IS NOT NULL AND NEW.allergy_severity NOT IN ('mild','moderate','severe','unknown') THEN RAISE EXCEPTION 'Choose a valid allergy severity'; END IF;
  IF NEW.lab_flag IS NOT NULL AND NEW.lab_flag NOT IN ('normal','low','high','critical','abnormal') THEN RAISE EXCEPTION 'Choose a valid lab result flag'; END IF;
  IF coalesce(preal, false) THEN
    IF NEW.record_type = 'lab_result' AND NEW.lab_value IS NULL THEN RAISE EXCEPTION 'Real-patient lab results need a result value'; END IF;
    IF NEW.record_type = 'allergy' AND NEW.allergy_severity IS NULL THEN RAISE EXCEPTION 'Real-patient allergies need a severity (choose Unknown if not known)'; END IF;
  END IF;

  IF concat_ws(' ', NEW.title, NEW.details, NEW.medication_name, NEW.dose, NEW.med_frequency, NEW.med_route, NEW.allergy_reaction, NEW.lab_value, NEW.lab_unit, NEW.lab_ref_range) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  IF NEW.bp_sys IS NOT NULL AND (NEW.bp_sys < 50 OR NEW.bp_sys > 300) THEN RAISE EXCEPTION 'Systolic blood pressure must be 50-300'; END IF;
  IF NEW.bp_dia IS NOT NULL AND (NEW.bp_dia < 20 OR NEW.bp_dia > 200) THEN RAISE EXCEPTION 'Diastolic blood pressure must be 20-200'; END IF;
  IF NEW.heart_rate IS NOT NULL AND (NEW.heart_rate < 20 OR NEW.heart_rate > 250) THEN RAISE EXCEPTION 'Heart rate must be 20-250'; END IF;
  IF NEW.weight_lb IS NOT NULL AND (NEW.weight_lb < 1 OR NEW.weight_lb > 1000) THEN RAISE EXCEPTION 'Weight must be 1-1000 lb'; END IF;
  IF NEW.temperature_f IS NOT NULL AND (NEW.temperature_f < 85 OR NEW.temperature_f > 115) THEN RAISE EXCEPTION 'Temperature must be 85-115 F'; END IF;
  IF NEW.record_type = 'medication' AND coalesce(length(trim(NEW.medication_name)),0) < 2 THEN RAISE EXCEPTION 'Medicine name is required'; END IF;
  NEW.author_email := nullif(auth.jwt() ->> 'email', '');
  NEW.created_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $function$;

CREATE OR REPLACE FUNCTION public.hc_pilot_audit_write()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE act text;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_patients' THEN
    act := CASE WHEN TG_OP = 'INSERT' THEN 'patient_created'
                WHEN NEW.archived_at IS NOT NULL AND OLD.archived_at IS NULL THEN 'patient_archived'
                ELSE 'patient_updated' END;
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
    VALUES (NEW.clinic_id, NEW.id, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), act);
  ELSE
    act := CASE WHEN TG_OP = 'INSERT' THEN 'record_added'
                WHEN NEW.status = 'stopped' THEN 'medicine_stopped'
                ELSE 'record_marked_error' END;
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, record_id, actor, actor_email, action)
    VALUES (NEW.clinic_id, NEW.patient_id, NEW.id, auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()), act);
  END IF;
  RETURN NEW;
END $function$;

-- Signing a real-patient note requires a password sign-in within the last 10 minutes.
CREATE OR REPLACE FUNCTION public.hc_pilot_real_sign_check()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE preal boolean; amr jsonb := auth.jwt() -> 'amr'; last_pw bigint;
BEGIN
  IF NEW.status = 'signed' AND OLD.status = 'draft' THEN
    SELECT is_real INTO preal FROM public.hc_pilot_patients WHERE id = OLD.patient_id;
    IF coalesce(preal, false) THEN
      IF amr IS NOT NULL AND jsonb_typeof(amr) = 'array' THEN
        SELECT max((e ->> 'timestamp')::bigint) INTO last_pw
          FROM jsonb_array_elements(amr) e
         WHERE e ->> 'method' = 'password' AND (e ->> 'timestamp') ~ '^[0-9]+$';
      END IF;
      IF last_pw IS NULL OR last_pw < extract(epoch FROM now())::bigint - 600 THEN
        RAISE EXCEPTION 'Confirm your password to sign a real-patient note' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS hc_pilot_visit_notes_real_sign ON public.hc_pilot_visit_notes;
CREATE TRIGGER hc_pilot_visit_notes_real_sign BEFORE UPDATE ON public.hc_pilot_visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_sign_check();