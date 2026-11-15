ALTER TABLE public.hc_pilot_patients
  ADD COLUMN IF NOT EXISTS preferred_name text,
  ADD COLUMN IF NOT EXISTS preferred_language text,
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state_region text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_relation text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
  ADD COLUMN IF NOT EXISTS primary_doctor text,
  ADD COLUMN IF NOT EXISTS photo_choice text;

CREATE OR REPLACE FUNCTION public.hc_pilot_patients_validate()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE all_text text; sample_key text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.clinic_id := OLD.clinic_id; NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at;
    NEW.test_patient_confirmed := OLD.test_patient_confirmed;
    NEW.is_sample := OLD.is_sample;
    NEW.is_real := OLD.is_real;
  ELSE
    NEW.is_sample := coalesce(current_setting('hc.pilot_seed', true), '') = 'on';
    IF NEW.is_sample THEN NEW.is_real := false; END IF;
  END IF;

  -- Made-up details for the three fixed sample patients (only when the loader creates them).
  IF TG_OP = 'INSERT' AND NEW.is_sample THEN
    sample_key := lower(trim(NEW.first_name) || '-' || trim(NEW.last_name));
    IF sample_key = 'marcus-bell' THEN
      NEW.preferred_name := coalesce(NEW.preferred_name, 'Marcus'); NEW.preferred_language := coalesce(NEW.preferred_language, 'English');
      NEW.address_line := coalesce(NEW.address_line, '101 Sample Street'); NEW.city := coalesce(NEW.city, 'Chicago'); NEW.state_region := coalesce(NEW.state_region, 'IL'); NEW.postal_code := coalesce(NEW.postal_code, '60600');
      NEW.emergency_contact_name := coalesce(NEW.emergency_contact_name, 'Denise Bell'); NEW.emergency_contact_relation := coalesce(NEW.emergency_contact_relation, 'Wife'); NEW.emergency_contact_phone := coalesce(NEW.emergency_contact_phone, '555-0142');
      NEW.phone := coalesce(NEW.phone, '555-0101'); NEW.primary_doctor := coalesce(NEW.primary_doctor, 'Dr. Avery Sample (made-up)');
      NEW.insurance_company := coalesce(NEW.insurance_company, 'Sample Health Plan'); NEW.insurance_plan := coalesce(NEW.insurance_plan, 'Gold PPO (sample)'); NEW.insurance_member_id := coalesce(NEW.insurance_member_id, 'SAMPLE-1001');
    ELSIF sample_key = 'alicia-grant' THEN
      NEW.preferred_name := coalesce(NEW.preferred_name, 'Ali'); NEW.preferred_language := coalesce(NEW.preferred_language, 'English');
      NEW.address_line := coalesce(NEW.address_line, '202 Example Avenue, Apt 3'); NEW.city := coalesce(NEW.city, 'Chicago'); NEW.state_region := coalesce(NEW.state_region, 'IL'); NEW.postal_code := coalesce(NEW.postal_code, '60600');
      NEW.emergency_contact_name := coalesce(NEW.emergency_contact_name, 'Robert Grant'); NEW.emergency_contact_relation := coalesce(NEW.emergency_contact_relation, 'Brother'); NEW.emergency_contact_phone := coalesce(NEW.emergency_contact_phone, '555-0177');
      NEW.phone := coalesce(NEW.phone, '555-0102'); NEW.primary_doctor := coalesce(NEW.primary_doctor, 'Dr. Avery Sample (made-up)');
      NEW.insurance_company := coalesce(NEW.insurance_company, 'Sample Health Plan'); NEW.insurance_plan := coalesce(NEW.insurance_plan, 'Silver HMO (sample)'); NEW.insurance_member_id := coalesce(NEW.insurance_member_id, 'SAMPLE-1002');
    ELSIF sample_key = 'harold-jenkins' THEN
      NEW.preferred_name := coalesce(NEW.preferred_name, 'Hal'); NEW.preferred_language := coalesce(NEW.preferred_language, 'English');
      NEW.address_line := coalesce(NEW.address_line, '303 Placeholder Road'); NEW.city := coalesce(NEW.city, 'Chicago'); NEW.state_region := coalesce(NEW.state_region, 'IL'); NEW.postal_code := coalesce(NEW.postal_code, '60600');
      NEW.emergency_contact_name := coalesce(NEW.emergency_contact_name, 'Karen Jenkins'); NEW.emergency_contact_relation := coalesce(NEW.emergency_contact_relation, 'Daughter'); NEW.emergency_contact_phone := coalesce(NEW.emergency_contact_phone, '555-0188');
      NEW.phone := coalesce(NEW.phone, '555-0103'); NEW.primary_doctor := coalesce(NEW.primary_doctor, 'Dr. Avery Sample (made-up)');
      NEW.insurance_company := coalesce(NEW.insurance_company, 'Sample Medicare Plan'); NEW.insurance_plan := coalesce(NEW.insurance_plan, 'Medicare Advantage (sample)'); NEW.insurance_member_id := coalesce(NEW.insurance_member_id, 'SAMPLE-1003');
    END IF;
  END IF;

  IF NEW.is_real THEN
    IF NOT public.hc_real_patients_allowed(NEW.clinic_id) THEN
      RAISE EXCEPTION 'Real patients are locked for this clinic. Go-live approval and every vendor agreement are required';
    END IF;
    IF NEW.test_patient_confirmed THEN RAISE EXCEPTION 'A real patient cannot also be marked as a test patient'; END IF;
    IF NEW.consent_signed_on IS NULL OR NEW.consent_signed_on > CURRENT_DATE OR NEW.consent_signed_on < DATE '2026-01-01' THEN
      RAISE EXCEPTION 'Record the date the patient signed the approved consent form';
    END IF;
    IF NEW.date_of_birth IS NULL THEN RAISE EXCEPTION 'Date of birth is required for real patients'; END IF;
    IF NEW.photo_choice IS NOT NULL THEN RAISE EXCEPTION 'Real patients cannot be given a sample face'; END IF;
  ELSE
    IF NEW.test_patient_confirmed IS NOT TRUE THEN
      RAISE EXCEPTION 'Pilot patients must be confirmed as made-up test patients, not real people';
    END IF;
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
  IF length(coalesce(NEW.insurance_company,'')) > 120 OR length(coalesce(NEW.insurance_plan,'')) > 120
     OR length(coalesce(NEW.insurance_member_id,'')) > 60 OR length(coalesce(NEW.insurance_group,'')) > 60
     OR length(coalesce(NEW.policy_holder,'')) > 120 THEN
    RAISE EXCEPTION 'An insurance field is too long';
  END IF;
  IF length(coalesce(NEW.preferred_name,'')) > 80 OR length(coalesce(NEW.preferred_language,'')) > 60
     OR length(coalesce(NEW.address_line,'')) > 160 OR length(coalesce(NEW.city,'')) > 80
     OR length(coalesce(NEW.state_region,'')) > 60 OR length(coalesce(NEW.postal_code,'')) > 20
     OR length(coalesce(NEW.emergency_contact_name,'')) > 120 OR length(coalesce(NEW.emergency_contact_relation,'')) > 60
     OR length(coalesce(NEW.emergency_contact_phone,'')) > 30 OR length(coalesce(NEW.primary_doctor,'')) > 120 THEN
    RAISE EXCEPTION 'A patient detail is too long';
  END IF;
  IF NEW.photo_choice IS NOT NULL AND NEW.photo_choice NOT IN ('face-01','face-02','face-03','face-04','face-05','face-06','face-07','face-08') THEN
    RAISE EXCEPTION 'Choose one of the sample faces';
  END IF;
  IF coalesce(array_length(NEW.allergies,1),0) > 30 OR coalesce(array_length(NEW.conditions,1),0) > 30 THEN RAISE EXCEPTION 'Too many list items'; END IF;
  all_text := concat_ws(' ', NEW.first_name, NEW.last_name, NEW.phone, NEW.insurance_company, NEW.insurance_plan,
    NEW.insurance_member_id, NEW.insurance_group, NEW.policy_holder, array_to_string(NEW.allergies,' '), array_to_string(NEW.conditions,' '),
    NEW.preferred_name, NEW.preferred_language, NEW.address_line, NEW.city, NEW.state_region, NEW.postal_code,
    NEW.emergency_contact_name, NEW.emergency_contact_relation, NEW.emergency_contact_phone, NEW.primary_doctor);
  IF all_text ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.updated_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $function$;