-- 1. Real-patient columns on the pilot patient table
ALTER TABLE public.hc_pilot_patients
  ADD COLUMN IF NOT EXISTS is_real boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_signed_on date,
  ADD COLUMN IF NOT EXISTS insurance_company text,
  ADD COLUMN IF NOT EXISTS insurance_plan text,
  ADD COLUMN IF NOT EXISTS insurance_member_id text,
  ADD COLUMN IF NOT EXISTS insurance_group text,
  ADD COLUMN IF NOT EXISTS policy_holder text;

-- 2. Go-live unlock records (one active per clinic)
CREATE TABLE public.hc_go_live_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  attorney_name text NOT NULL,
  attorney_approved_on date NOT NULL,
  approval_letter_ref text NOT NULL,
  consent_form_version text NOT NULL,
  lovable_ruling text NOT NULL,
  risk_assessment_ref text NOT NULL,
  clinic_agreement_signed_on date NOT NULL,
  clinic_agreement_ref text NOT NULL,
  unlocked_by uuid NOT NULL,
  unlocked_by_email text,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_by uuid,
  locked_by_email text,
  lock_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX hc_go_live_unlocks_one_active ON public.hc_go_live_unlocks(clinic_id) WHERE locked_at IS NULL;

GRANT SELECT ON public.hc_go_live_unlocks TO authenticated;
GRANT ALL ON public.hc_go_live_unlocks TO service_role;
ALTER TABLE public.hc_go_live_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and clinic members read go-live unlocks" ON public.hc_go_live_unlocks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.hc_is_member(clinic_id));
-- No insert/update/delete policies: changes only through the checked functions below.

-- 3. Server checks
CREATE OR REPLACE FUNCTION clinical_private.hc_vendors_all_cleared()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.hc_vendor_baas)
     AND NOT EXISTS (
       SELECT 1 FROM public.hc_vendor_baas v
       WHERE NOT ((v.status = 'signed' AND v.attorney_approved)
               OR (v.baa_category = 'keep_phi_away' AND v.status = 'kept_away_from_patient_data'))
     )
$$;
REVOKE ALL ON FUNCTION clinical_private.hc_vendors_all_cleared() FROM PUBLIC, anon;

-- True only when every vendor is cleared right now AND an active unlock exists.
-- If a vendor is later downgraded on the tracker, real-patient saving stops automatically.
CREATE OR REPLACE FUNCTION public.hc_real_patients_allowed(_clinic uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF NOT (public.hc_is_member(_clinic) OR public.has_role(auth.uid(), 'admin'::public.app_role)) THEN RETURN false; END IF;
  RETURN clinical_private.hc_vendors_all_cleared()
     AND EXISTS (SELECT 1 FROM public.hc_go_live_unlocks u WHERE u.clinic_id = _clinic AND u.locked_at IS NULL);
END $$;
REVOKE ALL ON FUNCTION public.hc_real_patients_allowed(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_real_patients_allowed(uuid) TO authenticated, service_role;

-- 4. Unlock (administrators only, all conditions checked here)
CREATE OR REPLACE FUNCTION public.hc_go_live_unlock(
  _clinic uuid, _attorney_name text, _attorney_approved_on date, _approval_letter_ref text,
  _consent_form_version text, _lovable_ruling text, _risk_assessment_ref text,
  _clinic_agreement_signed_on date, _clinic_agreement_ref text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE new_id uuid; me text := nullif(auth.jwt() ->> 'email', '');
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only an administrator can unlock real patients' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.hc_clinics WHERE id = _clinic) THEN RAISE EXCEPTION 'Clinic not found'; END IF;
  IF NOT clinical_private.hc_vendors_all_cleared() THEN
    RAISE EXCEPTION 'Every outside company on the Vendor BAA Tracker must be signed and attorney-approved (or confirmed kept away from patient data) first';
  END IF;
  IF coalesce(length(trim(_attorney_name)),0) < 3 OR length(_attorney_name) > 120 THEN RAISE EXCEPTION 'Enter the attorney''s full name'; END IF;
  IF coalesce(length(trim(_approval_letter_ref)),0) < 3 OR length(_approval_letter_ref) > 200 THEN RAISE EXCEPTION 'Enter a reference to the signed go-live letter'; END IF;
  IF coalesce(length(trim(_consent_form_version)),0) < 2 OR length(_consent_form_version) > 120 THEN RAISE EXCEPTION 'Enter the approved consent form version'; END IF;
  IF coalesce(length(trim(_lovable_ruling)),0) < 10 OR length(_lovable_ruling) > 1000 THEN RAISE EXCEPTION 'Enter the attorney''s written ruling on Lovable (at least 10 characters)'; END IF;
  IF coalesce(length(trim(_risk_assessment_ref)),0) < 3 OR length(_risk_assessment_ref) > 200 THEN RAISE EXCEPTION 'Enter a reference to the completed security risk assessment'; END IF;
  IF coalesce(length(trim(_clinic_agreement_ref)),0) < 3 OR length(_clinic_agreement_ref) > 200 THEN RAISE EXCEPTION 'Enter a reference to the signed clinic agreement'; END IF;
  IF _attorney_approved_on IS NULL OR _attorney_approved_on > CURRENT_DATE OR _attorney_approved_on < DATE '2026-01-01' THEN RAISE EXCEPTION 'Attorney approval date must be a real date, not in the future'; END IF;
  IF _clinic_agreement_signed_on IS NULL OR _clinic_agreement_signed_on > CURRENT_DATE OR _clinic_agreement_signed_on < DATE '2026-01-01' THEN RAISE EXCEPTION 'Clinic agreement date must be a real date, not in the future'; END IF;
  IF EXISTS (SELECT 1 FROM public.hc_go_live_unlocks WHERE clinic_id = _clinic AND locked_at IS NULL) THEN RAISE EXCEPTION 'This clinic is already unlocked'; END IF;

  INSERT INTO public.hc_go_live_unlocks(clinic_id, attorney_name, attorney_approved_on, approval_letter_ref, consent_form_version,
    lovable_ruling, risk_assessment_ref, clinic_agreement_signed_on, clinic_agreement_ref, unlocked_by, unlocked_by_email)
  VALUES (_clinic, trim(_attorney_name), _attorney_approved_on, trim(_approval_letter_ref), trim(_consent_form_version),
    trim(_lovable_ruling), trim(_risk_assessment_ref), _clinic_agreement_signed_on, trim(_clinic_agreement_ref), auth.uid(), me)
  RETURNING id INTO new_id;
  INSERT INTO public.hc_pilot_audit(clinic_id, actor, actor_email, action) VALUES (_clinic, auth.uid(), me, 'go_live_unlocked');
  RETURN new_id;
END $$;
REVOKE ALL ON FUNCTION public.hc_go_live_unlock(uuid, text, date, text, text, text, text, date, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_go_live_unlock(uuid, text, date, text, text, text, text, date, text) TO authenticated, service_role;

-- 5. Lock again (administrator or clinic owner)
CREATE OR REPLACE FUNCTION public.hc_go_live_lock(_clinic uuid, _reason text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE me text := nullif(auth.jwt() ->> 'email', ''); n int;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.hc_is_owner(_clinic)) THEN
    RAISE EXCEPTION 'Only an administrator or the clinic owner can lock real patients' USING ERRCODE = '42501';
  END IF;
  IF coalesce(length(trim(_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason (at least 3 characters)'; END IF;
  UPDATE public.hc_go_live_unlocks
     SET locked_at = now(), locked_by = auth.uid(), locked_by_email = me, lock_reason = left(trim(_reason), 300), updated_at = now()
   WHERE clinic_id = _clinic AND locked_at IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN RAISE EXCEPTION 'This clinic is not unlocked'; END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, actor, actor_email, action) VALUES (_clinic, auth.uid(), me, 'go_live_locked');
  RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.hc_go_live_lock(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_go_live_lock(uuid, text) TO authenticated, service_role;

-- 6. Status for the Go-live screen
CREATE OR REPLACE FUNCTION public.hc_go_live_status(_clinic uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE is_admin boolean := public.has_role(auth.uid(), 'admin'::public.app_role); u record;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.hc_is_member(_clinic) OR is_admin) THEN
    RAISE EXCEPTION 'Not a member of this clinic' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO u FROM public.hc_go_live_unlocks WHERE clinic_id = _clinic AND locked_at IS NULL;
  RETURN jsonb_build_object(
    'real_patients_allowed', clinical_private.hc_vendors_all_cleared() AND u.id IS NOT NULL,
    'vendors_cleared', clinical_private.hc_vendors_all_cleared(),
    'can_unlock', is_admin,
    'can_lock', is_admin OR public.hc_is_owner(_clinic),
    'active_unlock', CASE WHEN u.id IS NULL THEN NULL ELSE jsonb_build_object(
      'attorney_name', u.attorney_name, 'attorney_approved_on', u.attorney_approved_on,
      'approval_letter_ref', u.approval_letter_ref, 'consent_form_version', u.consent_form_version,
      'lovable_ruling', u.lovable_ruling, 'risk_assessment_ref', u.risk_assessment_ref,
      'clinic_agreement_signed_on', u.clinic_agreement_signed_on, 'clinic_agreement_ref', u.clinic_agreement_ref,
      'unlocked_at', u.unlocked_at, 'unlocked_by_email', u.unlocked_by_email) END,
    'vendors', coalesce((SELECT jsonb_agg(jsonb_build_object('vendor_name', v.vendor_name, 'baa_category', v.baa_category,
        'status', v.status, 'attorney_approved', v.attorney_approved) ORDER BY v.sort_order) FROM public.hc_vendor_baas v), '[]'::jsonb)
  );
END $$;

-- 7. Patient rules: test patients as before; real patients only when unlocked
CREATE OR REPLACE FUNCTION public.hc_pilot_patients_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $function$
DECLARE all_text text;
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

  IF NEW.is_real THEN
    IF NOT public.hc_real_patients_allowed(NEW.clinic_id) THEN
      RAISE EXCEPTION 'Real patients are locked for this clinic. Go-live approval and every vendor agreement are required';
    END IF;
    IF NEW.test_patient_confirmed THEN RAISE EXCEPTION 'A real patient cannot also be marked as a test patient'; END IF;
    IF NEW.consent_signed_on IS NULL OR NEW.consent_signed_on > CURRENT_DATE OR NEW.consent_signed_on < DATE '2026-01-01' THEN
      RAISE EXCEPTION 'Record the date the patient signed the approved consent form';
    END IF;
    IF NEW.date_of_birth IS NULL THEN RAISE EXCEPTION 'Date of birth is required for real patients'; END IF;
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
  IF coalesce(array_length(NEW.allergies,1),0) > 30 OR coalesce(array_length(NEW.conditions,1),0) > 30 THEN RAISE EXCEPTION 'Too many list items'; END IF;
  all_text := concat_ws(' ', NEW.first_name, NEW.last_name, NEW.phone, NEW.insurance_company, NEW.insurance_plan,
    NEW.insurance_member_id, NEW.insurance_group, NEW.policy_holder, array_to_string(NEW.allergies,' '), array_to_string(NEW.conditions,' '));
  IF all_text ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.updated_by := auth.uid(); NEW.updated_at := now();
  RETURN NEW;
END $function$;

-- 8. Charts of real patients can only be added to while unlocked
CREATE OR REPLACE FUNCTION public.hc_pilot_real_write_lock()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pid uuid; real boolean;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_note_addenda' THEN
    SELECT patient_id INTO pid FROM public.hc_pilot_visit_notes WHERE id = NEW.note_id;
  ELSE
    pid := NEW.patient_id;
  END IF;
  SELECT is_real INTO real FROM public.hc_pilot_patients WHERE id = pid;
  IF coalesce(real, false) AND NOT public.hc_real_patients_allowed(NEW.clinic_id) THEN
    RAISE EXCEPTION 'Real patients are locked for this clinic. Changes are paused until go-live is unlocked again';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_records_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_records
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();
CREATE TRIGGER hc_pilot_visit_notes_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();
CREATE TRIGGER hc_pilot_note_addenda_real_lock BEFORE INSERT ON public.hc_pilot_note_addenda
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

-- 9. Reset never erases real patients or their history
CREATE OR REPLACE FUNCTION public.hc_pilot_reset(_clinic uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can reset the pilot'; END IF;
  IF EXISTS (SELECT 1 FROM public.hc_pilot_patients WHERE clinic_id = _clinic AND is_real) THEN
    RAISE EXCEPTION 'Reset is turned off once a clinic has real patients, so their records and history are never erased';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('hc_pilot_seed:' || _clinic::text));
  DELETE FROM public.hc_pilot_patients WHERE clinic_id = _clinic;
  DELETE FROM public.hc_pilot_audit WHERE clinic_id = _clinic AND action NOT IN ('go_live_unlocked','go_live_locked');
  INSERT INTO public.hc_pilot_audit(clinic_id, actor, actor_email, action)
  VALUES (_clinic, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'pilot_reset');
  RETURN public.hc_pilot_seed_samples(_clinic);
END $function$;