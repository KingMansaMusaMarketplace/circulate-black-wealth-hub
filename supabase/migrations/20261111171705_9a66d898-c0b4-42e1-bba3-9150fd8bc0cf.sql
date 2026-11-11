CREATE OR REPLACE FUNCTION public.hc_pilot_appointments_validate()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE pclinic uuid; prole text; pemail text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('completed','cancelled','no_show','discharged','left_ama') THEN RAISE EXCEPTION 'This appointment is already closed'; END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.created_by := OLD.created_by;
    NEW.created_by_email := OLD.created_by_email; NEW.created_at := OLD.created_at; NEW.updated_at := now();
    IF NEW.status = 'scheduled' AND OLD.status = 'scheduled' THEN
      NEW.checked_in_at := NULL; NEW.status_reason := OLD.status_reason;
    ELSE
      IF NEW.status = 'checked_in' AND OLD.status = 'scheduled' THEN
        NEW.checked_in_at := now(); NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'completed' AND OLD.status = 'checked_in' THEN
        NEW.checked_in_at := OLD.checked_in_at; NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'discharged' AND OLD.status = 'checked_in' THEN
        IF NOT public.hc_has_clinic_role(OLD.clinic_id, ARRAY['owner','doctor','nurse']) THEN RAISE EXCEPTION 'Only a doctor or nurse can discharge a patient'; END IF;
        NEW.checked_in_at := OLD.checked_in_at; NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'left_ama' AND OLD.status = 'checked_in' THEN
        IF NOT public.hc_has_clinic_role(OLD.clinic_id, ARRAY['owner','doctor','nurse']) THEN RAISE EXCEPTION 'Only a doctor or nurse can record a patient leaving against medical advice'; END IF;
        IF coalesce(length(trim(NEW.status_reason)),0) < 3 THEN RAISE EXCEPTION 'Describe why the patient left against medical advice (at least 3 characters)'; END IF;
        IF NEW.status_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
        IF length(trim(NEW.status_reason)) > 300 THEN RAISE EXCEPTION 'Reason is too long (300 characters max)'; END IF;
        NEW.status_reason := trim(NEW.status_reason); NEW.checked_in_at := OLD.checked_in_at;
      ELSIF NEW.status = 'no_show' AND OLD.status = 'scheduled' THEN
        NEW.checked_in_at := OLD.checked_in_at; NEW.status_reason := OLD.status_reason;
      ELSIF NEW.status = 'cancelled' AND OLD.status IN ('scheduled','checked_in') THEN
        IF coalesce(length(trim(NEW.status_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for cancelling (at least 3 characters)'; END IF;
        IF NEW.status_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
        NEW.status_reason := left(trim(NEW.status_reason), 300); NEW.checked_in_at := OLD.checked_in_at;
      ELSE
        RAISE EXCEPTION 'An appointment moves from booked to checked in to done, discharged or left against medical advice, or is cancelled or marked no-show';
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
END $function$;