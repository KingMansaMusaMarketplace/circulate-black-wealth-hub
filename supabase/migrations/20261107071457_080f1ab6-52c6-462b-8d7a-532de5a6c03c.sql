CREATE OR REPLACE FUNCTION public.hc_pilot_records_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE pclinic uuid;
BEGIN
  IF TG_OP = 'UPDATE' THEN
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
  IF NEW.record_type = 'medication' AND coalesce(length(trim(NEW.medication_name)),0) < 2 THEN RAISE EXCEPTION 'Medicine name is required'; END IF;
  NEW.author_email := nullif(auth.jwt() ->> 'email', '');
  NEW.created_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $$;