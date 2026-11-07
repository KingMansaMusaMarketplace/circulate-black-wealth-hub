ALTER TABLE public.hc_pilot_patients ADD COLUMN IF NOT EXISTS is_sample boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.hc_pilot_patients_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE all_text text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.clinic_id := OLD.clinic_id; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
    NEW.test_patient_confirmed := OLD.test_patient_confirmed;
    NEW.is_sample := OLD.is_sample;
  ELSE
    -- Only the built-in sample loader may label a patient as a sample.
    NEW.is_sample := coalesce(current_setting('hc.pilot_seed', true), '') = 'on';
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

-- Loads 3 made-up sample patients into an empty pilot clinic. Runs as the signed-in member so every
-- existing validation and activity-log trigger applies exactly as for hand-entered test patients.
CREATE OR REPLACE FUNCTION public.hc_pilot_seed_samples(_clinic uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p1 uuid; p2 uuid; p3 uuid; n uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF NOT public.hc_is_member(_clinic) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('hc_pilot_seed:' || _clinic::text));
  IF EXISTS (SELECT 1 FROM public.hc_pilot_patients WHERE clinic_id = _clinic) THEN RETURN 0; END IF;

  PERFORM set_config('hc.pilot_seed', 'on', true);
  INSERT INTO public.hc_pilot_patients(clinic_id, first_name, last_name, date_of_birth, sex, allergies, conditions, test_patient_confirmed)
  VALUES (_clinic, 'Marcus', 'Bell', DATE '1967-03-14', 'male', ARRAY['Penicillin'], ARRAY['High blood pressure','Type 2 diabetes'], true)
  RETURNING id INTO p1;
  INSERT INTO public.hc_pilot_patients(clinic_id, first_name, last_name, date_of_birth, sex, allergies, conditions, test_patient_confirmed)
  VALUES (_clinic, 'Alicia', 'Grant', DATE '1991-08-02', 'female', ARRAY['Peanuts'], ARRAY['Asthma'], true)
  RETURNING id INTO p2;
  INSERT INTO public.hc_pilot_patients(clinic_id, first_name, last_name, date_of_birth, sex, allergies, conditions, test_patient_confirmed)
  VALUES (_clinic, 'Harold', 'Jenkins', DATE '1954-11-21', 'male', ARRAY['Sulfa drugs'], ARRAY['Heart failure','Chronic kidney disease, stage 3'], true)
  RETURNING id INTO p3;
  PERFORM set_config('hc.pilot_seed', 'off', true);

  INSERT INTO public.hc_pilot_records(clinic_id, patient_id, record_type, recorded_on, title, details, bp_sys, bp_dia, heart_rate, weight_lb, temperature_f, medication_name, dose) VALUES
    (_clinic, p1, 'vitals', CURRENT_DATE - 2, 'Clinic vitals', 'Sample test patient', 148, 92, 78, 212, 98.4, NULL, NULL),
    (_clinic, p1, 'vitals', CURRENT_DATE - 32, 'Clinic vitals', 'Sample test patient', 154, 96, 82, 215, 98.6, NULL, NULL),
    (_clinic, p1, 'medication', CURRENT_DATE - 2, 'Blood pressure medicine', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Lisinopril', '20 mg once daily'),
    (_clinic, p1, 'medication', CURRENT_DATE - 2, 'Diabetes medicine', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Metformin', '1000 mg twice daily'),
    (_clinic, p1, 'allergy', CURRENT_DATE - 32, 'Penicillin allergy', 'Rash (sample)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    (_clinic, p1, 'lab_result', CURRENT_DATE - 5, 'Hemoglobin A1c', 'A1c 8.1% (sample value)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    (_clinic, p1, 'problem', CURRENT_DATE - 32, 'High blood pressure', 'Above goal (sample)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),

    (_clinic, p2, 'vitals', CURRENT_DATE - 1, 'Clinic vitals', 'Sample test patient', 118, 76, 88, 142, 99.1, NULL, NULL),
    (_clinic, p2, 'medication', CURRENT_DATE - 1, 'Rescue inhaler', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Albuterol inhaler', '2 puffs every 4-6 hours as needed'),
    (_clinic, p2, 'medication', CURRENT_DATE - 1, 'Controller inhaler', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Fluticasone inhaler', '2 puffs twice daily'),
    (_clinic, p2, 'allergy', CURRENT_DATE - 60, 'Peanut allergy', 'Hives (sample)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    (_clinic, p2, 'lab_result', CURRENT_DATE - 1, 'Peak flow', '320 L/min, about 75% of personal best (sample value)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),

    (_clinic, p3, 'vitals', CURRENT_DATE - 3, 'Clinic vitals', 'Sample test patient', 132, 80, 72, 186, 98.2, NULL, NULL),
    (_clinic, p3, 'vitals', CURRENT_DATE - 17, 'Clinic vitals', 'Sample test patient', 138, 84, 76, 191, 98.3, NULL, NULL),
    (_clinic, p3, 'medication', CURRENT_DATE - 3, 'Water pill', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Furosemide', '40 mg once daily'),
    (_clinic, p3, 'medication', CURRENT_DATE - 3, 'Heart medicine', 'Sample test patient', NULL, NULL, NULL, NULL, NULL, 'Carvedilol', '12.5 mg twice daily'),
    (_clinic, p3, 'allergy', CURRENT_DATE - 90, 'Sulfa drug allergy', 'Swelling (sample)', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    (_clinic, p3, 'lab_result', CURRENT_DATE - 4, 'Kidney function (eGFR)', 'eGFR 48 (sample value)', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

  INSERT INTO public.hc_pilot_visit_notes(clinic_id, patient_id, visit_date, visit_reason, subjective, objective, assessment, plan)
  VALUES (_clinic, p1, CURRENT_DATE - 2, 'Blood pressure and diabetes follow-up',
    'Sample test patient. Reports missing evening metformin a few times a week. No chest pain or vision changes.',
    'BP 148/92, HR 78, weight 212 lb. Feet: no sores.',
    'High blood pressure above goal. Type 2 diabetes, A1c 8.1%.',
    'Continue lisinopril 20 mg. Pill organizer for metformin. Repeat A1c in 3 months. Return in 4 weeks for BP check.')
  RETURNING id INTO n;
  UPDATE public.hc_pilot_visit_notes SET status = 'signed' WHERE id = n;

  INSERT INTO public.hc_pilot_visit_notes(clinic_id, patient_id, visit_date, visit_reason, subjective, objective, assessment, plan)
  VALUES (_clinic, p2, CURRENT_DATE - 1, 'Asthma check after a cold',
    'Sample test patient. Cough and wheeze for 5 days after a cold. Using rescue inhaler 3 times a day.',
    'Temp 99.1 F, HR 88. Mild wheeze both sides. Peak flow 320 (about 75% of best).',
    'Mild asthma flare after a viral cold.',
    'Use controller inhaler twice daily every day. Rescue inhaler as needed. Written asthma action plan given. Return if worse or in 2 weeks.')
  RETURNING id INTO n;
  UPDATE public.hc_pilot_visit_notes SET status = 'signed' WHERE id = n;

  INSERT INTO public.hc_pilot_visit_notes(clinic_id, patient_id, visit_date, visit_reason, subjective, objective, assessment, plan)
  VALUES (_clinic, p3, CURRENT_DATE - 3, 'Heart failure follow-up',
    'Sample test patient. Breathing better. Ankle swelling down. Sleeping on one pillow.',
    'BP 132/80, HR 72, weight 186 lb (down 5 lb in 2 weeks). Trace ankle swelling.',
    'Heart failure, improving. Kidney disease stage 3, stable (eGFR 48).',
    'Continue furosemide 40 mg and carvedilol 12.5 mg. Daily weights; call if up 3 lb in a day. Repeat kidney labs in 2 weeks.')
  RETURNING id INTO n;
  UPDATE public.hc_pilot_visit_notes SET status = 'signed' WHERE id = n;

  RETURN 3;
END $$;
REVOKE ALL ON FUNCTION public.hc_pilot_seed_samples(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_pilot_seed_samples(uuid) TO authenticated;

-- Owner-only: clears this clinic's test patients and activity, then reloads the 3 sample patients.
CREATE OR REPLACE FUNCTION public.hc_pilot_reset(_clinic uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can reset the pilot'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('hc_pilot_seed:' || _clinic::text));
  DELETE FROM public.hc_pilot_patients WHERE clinic_id = _clinic;
  DELETE FROM public.hc_pilot_audit WHERE clinic_id = _clinic;
  INSERT INTO public.hc_pilot_audit(clinic_id, actor, actor_email, action)
  VALUES (_clinic, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'pilot_reset');
  RETURN public.hc_pilot_seed_samples(_clinic);
END $$;
REVOKE ALL ON FUNCTION public.hc_pilot_reset(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_pilot_reset(uuid) TO authenticated;

-- One-time emailed sign-in codes for approved clinical guests. Server-only.
CREATE TABLE public.hc_signin_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.hc_access_requests(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_signin_codes_request_idx ON public.hc_signin_codes(request_id, created_at DESC);
REVOKE ALL ON public.hc_signin_codes FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.hc_signin_codes TO service_role;
ALTER TABLE public.hc_signin_codes ENABLE ROW LEVEL SECURITY;