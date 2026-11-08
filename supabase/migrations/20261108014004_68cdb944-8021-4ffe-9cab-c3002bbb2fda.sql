-- ===== Role helpers =====
CREATE OR REPLACE FUNCTION public.hc_member_role(_clinic uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT CASE WHEN clinical_private.hc_has_preview_access()
    THEN (SELECT role FROM public.hc_members WHERE clinic_id = _clinic AND user_id = auth.uid() LIMIT 1) END
$$;
CREATE OR REPLACE FUNCTION public.hc_has_clinic_role(_clinic uuid, _roles text[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT coalesce(public.hc_member_role(_clinic) = ANY(_roles), false)
$$;

-- ===== Emergency (break the glass) access =====
CREATE TABLE public.hc_pilot_glass_breaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_email text,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
GRANT SELECT ON public.hc_pilot_glass_breaks TO authenticated;
GRANT ALL ON public.hc_pilot_glass_breaks TO service_role;
ALTER TABLE public.hc_pilot_glass_breaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own or owner reads emergency access" ON public.hc_pilot_glass_breaks FOR SELECT TO authenticated
  USING (public.hc_is_member(clinic_id) AND (user_id = auth.uid() OR public.hc_is_owner(clinic_id)));
CREATE INDEX hc_pilot_glass_breaks_lookup ON public.hc_pilot_glass_breaks (clinic_id, patient_id, user_id, expires_at);

CREATE OR REPLACE FUNCTION public.hc_glass_active(_clinic uuid, _patient uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.hc_is_member(_clinic) AND EXISTS (
    SELECT 1 FROM public.hc_pilot_glass_breaks
    WHERE clinic_id = _clinic AND patient_id = _patient AND user_id = auth.uid() AND expires_at > now())
$$;
CREATE OR REPLACE FUNCTION public.hc_can_read_chart(_clinic uuid, _patient uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.hc_has_clinic_role(_clinic, ARRAY['owner','doctor','nurse']) OR public.hc_glass_active(_clinic, _patient)
$$;

CREATE OR REPLACE FUNCTION public.hc_pilot_break_glass(_patient uuid, _reason text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE c uuid; r text := trim(coalesce(_reason, '')); until timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT clinic_id INTO c FROM public.hc_pilot_patients WHERE id = _patient;
  IF c IS NULL OR NOT public.hc_is_member(c) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF public.hc_has_clinic_role(c, ARRAY['owner','doctor','nurse']) THEN RAISE EXCEPTION 'You already have access to this chart'; END IF;
  IF length(r) < 10 OR length(r) > 300 THEN RAISE EXCEPTION 'Explain the emergency in 10 to 300 characters'; END IF;
  IF r ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  until := now() + interval '30 minutes';
  INSERT INTO public.hc_pilot_glass_breaks(clinic_id, patient_id, user_id, user_email, reason, expires_at)
  VALUES (c, _patient, auth.uid(), nullif(auth.jwt() ->> 'email', ''), r, until);
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
  VALUES (c, _patient, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'emergency_access');
  RETURN until;
END $$;

REVOKE ALL ON FUNCTION public.hc_member_role(uuid), public.hc_has_clinic_role(uuid, text[]), public.hc_glass_active(uuid, uuid),
  public.hc_can_read_chart(uuid, uuid), public.hc_pilot_break_glass(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hc_member_role(uuid), public.hc_has_clinic_role(uuid, text[]), public.hc_glass_active(uuid, uuid),
  public.hc_can_read_chart(uuid, uuid), public.hc_pilot_break_glass(uuid, text) TO authenticated, service_role;

-- ===== Team roles =====
CREATE OR REPLACE FUNCTION public.hc_add_member(_clinic uuid, _email text, _role text DEFAULT 'doctor'::text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE target uuid; saved uuid;
BEGIN
 IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can add team members'; END IF;
 IF _role IS NULL OR _role NOT IN ('doctor','nurse','front_desk','biller') THEN RAISE EXCEPTION 'Role must be doctor, nurse, front desk or biller'; END IF;
 SELECT id INTO target FROM auth.users WHERE lower(email)=lower(trim(_email)) LIMIT 1;
 IF target IS NULL THEN RETURN 'not_found'; END IF;
 IF target=auth.uid() OR EXISTS (SELECT 1 FROM public.hc_clinics WHERE id=_clinic AND created_by=target) OR EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id=_clinic AND user_id=target AND role='owner') THEN RAISE EXCEPTION 'Clinic ownership cannot be changed by adding a team member'; END IF;
 INSERT INTO public.hc_members(clinic_id,user_id,role,email) VALUES (_clinic,target,_role,lower(trim(_email))) ON CONFLICT (clinic_id,user_id) DO UPDATE SET role=EXCLUDED.role WHERE hc_members.role <> 'owner' RETURNING id INTO saved;
 IF saved IS NULL THEN RAISE EXCEPTION 'Clinic ownership cannot be changed by adding a team member'; END IF;
 RETURN 'added';
END $function$;

-- ===== Role-aware chart access on existing pilot tables =====
DROP POLICY IF EXISTS "Clinic members read pilot records" ON public.hc_pilot_records;
DROP POLICY IF EXISTS "Clinic members add pilot records" ON public.hc_pilot_records;
DROP POLICY IF EXISTS "Clinic members correct pilot records" ON public.hc_pilot_records;
CREATE POLICY "Chart readers read pilot records" ON public.hc_pilot_records FOR SELECT TO authenticated
  USING (public.hc_can_read_chart(clinic_id, patient_id));
CREATE POLICY "Clinicians add pilot records" ON public.hc_pilot_records FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']) AND created_by = auth.uid());
CREATE POLICY "Clinicians correct pilot records" ON public.hc_pilot_records FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']));

DROP POLICY IF EXISTS "Clinic members read pilot visit notes" ON public.hc_pilot_visit_notes;
DROP POLICY IF EXISTS "Clinic members draft pilot visit notes" ON public.hc_pilot_visit_notes;
DROP POLICY IF EXISTS "Clinic members update pilot visit notes" ON public.hc_pilot_visit_notes;
CREATE POLICY "Chart readers read pilot visit notes" ON public.hc_pilot_visit_notes FOR SELECT TO authenticated
  USING (public.hc_can_read_chart(clinic_id, patient_id));
CREATE POLICY "Clinicians draft pilot visit notes" ON public.hc_pilot_visit_notes FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']) AND created_by = auth.uid());
CREATE POLICY "Clinicians update pilot visit notes" ON public.hc_pilot_visit_notes FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']));

DROP POLICY IF EXISTS "Clinic members read pilot note addenda" ON public.hc_pilot_note_addenda;
DROP POLICY IF EXISTS "Clinic members add pilot note addenda" ON public.hc_pilot_note_addenda;
CREATE POLICY "Chart readers read pilot note addenda" ON public.hc_pilot_note_addenda FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hc_pilot_visit_notes n WHERE n.id = note_id AND public.hc_can_read_chart(n.clinic_id, n.patient_id)));
CREATE POLICY "Clinicians add pilot note addenda" ON public.hc_pilot_note_addenda FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']) AND created_by = auth.uid());

DROP POLICY IF EXISTS "Clinic members add pilot patients" ON public.hc_pilot_patients;
DROP POLICY IF EXISTS "Clinic members update pilot patients" ON public.hc_pilot_patients;
CREATE POLICY "Registering staff add pilot patients" ON public.hc_pilot_patients FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']) AND created_by = auth.uid());
CREATE POLICY "Registering staff update pilot patients" ON public.hc_pilot_patients FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']));

-- Only doctors (or the owner) may sign a visit note.
CREATE OR REPLACE FUNCTION public.hc_pilot_note_signer_role()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.status = 'signed' AND OLD.status = 'draft' AND NOT public.hc_has_clinic_role(NEW.clinic_id, ARRAY['owner','doctor']) THEN
    RAISE EXCEPTION 'Only a doctor can sign a visit note. Save it as a draft for the doctor to sign';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS hc_pilot_visit_notes_signer_role ON public.hc_pilot_visit_notes;
CREATE TRIGGER hc_pilot_visit_notes_signer_role BEFORE UPDATE ON public.hc_pilot_visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_note_signer_role();

-- ===== Practice prescriptions (never sent to a pharmacy) =====
CREATE TABLE public.hc_pilot_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  strength text,
  dose text NOT NULL,
  route text NOT NULL,
  frequency text NOT NULL,
  quantity integer NOT NULL,
  refills integer NOT NULL DEFAULT 0,
  days_supply integer,
  instructions text NOT NULL,
  indication text,
  prescribed_on date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active',
  stopped_on date,
  stop_reason text,
  error_reason text,
  warnings text[] NOT NULL DEFAULT '{}',
  override_reason text,
  renewed_from uuid REFERENCES public.hc_pilot_prescriptions(id) ON DELETE SET NULL,
  prescriber_id uuid NOT NULL DEFAULT auth.uid(),
  prescriber_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_prescriptions TO authenticated;
GRANT ALL ON public.hc_pilot_prescriptions TO service_role;
ALTER TABLE public.hc_pilot_prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chart readers read pilot prescriptions" ON public.hc_pilot_prescriptions FOR SELECT TO authenticated
  USING (public.hc_can_read_chart(clinic_id, patient_id));
CREATE POLICY "Doctors write pilot prescriptions" ON public.hc_pilot_prescriptions FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor']) AND prescriber_id = auth.uid());
CREATE POLICY "Doctors change pilot prescriptions" ON public.hc_pilot_prescriptions FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor']));
CREATE INDEX hc_pilot_prescriptions_patient ON public.hc_pilot_prescriptions (clinic_id, patient_id, prescribed_on DESC);

CREATE OR REPLACE FUNCTION public.hc_pilot_prescriptions_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pclinic uuid; pallergies text[]; drug text; allergy_hit boolean; prev record;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('entered_in_error','renewed') AND NOT (OLD.status = 'renewed' AND NEW.status = 'entered_in_error') THEN
      RAISE EXCEPTION 'This prescription can no longer be changed';
    END IF;
    IF NEW.status = 'renewed' THEN
      IF coalesce(current_setting('hc.rx_renew', true), '') <> 'on' OR OLD.status <> 'active' THEN
        RAISE EXCEPTION 'Renew a prescription by writing the renewal';
      END IF;
    ELSIF NEW.status = 'stopped' THEN
      IF OLD.status <> 'active' THEN RAISE EXCEPTION 'Only an active prescription can be stopped'; END IF;
      IF NEW.stopped_on IS NULL OR NEW.stopped_on > CURRENT_DATE + 1 OR NEW.stopped_on < OLD.prescribed_on THEN
        RAISE EXCEPTION 'Stop date must be on or after the prescription date and not in the future';
      END IF;
      IF coalesce(length(trim(NEW.stop_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for stopping (at least 3 characters)'; END IF;
      NEW.stop_reason := left(trim(NEW.stop_reason), 300);
      NEW.error_reason := OLD.error_reason;
    ELSIF NEW.status = 'entered_in_error' THEN
      IF coalesce(length(trim(NEW.error_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason (at least 3 characters)'; END IF;
      NEW.error_reason := left(trim(NEW.error_reason), 300);
      NEW.stopped_on := OLD.stopped_on; NEW.stop_reason := OLD.stop_reason;
    ELSE
      RAISE EXCEPTION 'Prescriptions can only be stopped, renewed or marked as entered in error';
    END IF;
    IF concat_ws(' ', NEW.stop_reason, NEW.error_reason) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.drug_name := OLD.drug_name; NEW.strength := OLD.strength;
    NEW.dose := OLD.dose; NEW.route := OLD.route; NEW.frequency := OLD.frequency; NEW.quantity := OLD.quantity; NEW.refills := OLD.refills;
    NEW.days_supply := OLD.days_supply; NEW.instructions := OLD.instructions; NEW.indication := OLD.indication;
    NEW.prescribed_on := OLD.prescribed_on; NEW.warnings := OLD.warnings; NEW.override_reason := OLD.override_reason;
    NEW.renewed_from := OLD.renewed_from; NEW.prescriber_id := OLD.prescriber_id; NEW.prescriber_email := OLD.prescriber_email;
    NEW.created_at := OLD.created_at; NEW.updated_at := now();
    RETURN NEW;
  END IF;

  IF NOT public.hc_has_clinic_role(NEW.clinic_id, ARRAY['owner','doctor']) THEN RAISE EXCEPTION 'Only a doctor can write a prescription'; END IF;
  SELECT clinic_id, allergies INTO pclinic, pallergies FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  NEW.status := 'active'; NEW.stopped_on := NULL; NEW.stop_reason := NULL; NEW.error_reason := NULL;
  NEW.prescriber_id := auth.uid(); NEW.prescriber_email := nullif(auth.jwt() ->> 'email', '');
  NEW.prescribed_on := coalesce(NEW.prescribed_on, CURRENT_DATE);
  IF NEW.prescribed_on > CURRENT_DATE + 1 OR NEW.prescribed_on < CURRENT_DATE - 30 THEN RAISE EXCEPTION 'Prescription date must be within the last 30 days'; END IF;
  NEW.drug_name := trim(NEW.drug_name); NEW.dose := trim(NEW.dose); NEW.frequency := trim(NEW.frequency); NEW.instructions := trim(NEW.instructions);
  NEW.strength := nullif(trim(coalesce(NEW.strength,'')), ''); NEW.indication := nullif(trim(coalesce(NEW.indication,'')), '');
  NEW.override_reason := nullif(trim(coalesce(NEW.override_reason,'')), '');
  IF length(NEW.drug_name) < 2 OR length(NEW.drug_name) > 120 THEN RAISE EXCEPTION 'Medicine name is required (120 characters max)'; END IF;
  IF length(NEW.dose) < 1 OR length(NEW.dose) > 60 THEN RAISE EXCEPTION 'Dose is required (60 characters max)'; END IF;
  IF length(NEW.frequency) < 2 OR length(NEW.frequency) > 60 THEN RAISE EXCEPTION 'How often is required (60 characters max)'; END IF;
  IF length(NEW.instructions) < 5 OR length(NEW.instructions) > 500 THEN RAISE EXCEPTION 'Directions for the patient are required (5 to 500 characters)'; END IF;
  IF length(coalesce(NEW.strength,'')) > 60 OR length(coalesce(NEW.indication,'')) > 200 OR length(coalesce(NEW.override_reason,'')) > 500 THEN RAISE EXCEPTION 'A prescription field is too long'; END IF;
  IF NEW.route NOT IN ('by mouth','under the tongue','on the skin','inhaled','injection','eye drops','ear drops','nasal','rectal','other') THEN RAISE EXCEPTION 'Choose how the medicine is taken'; END IF;
  IF NEW.quantity IS NULL OR NEW.quantity < 1 OR NEW.quantity > 1000 THEN RAISE EXCEPTION 'Quantity must be between 1 and 1,000'; END IF;
  IF NEW.refills IS NULL OR NEW.refills < 0 OR NEW.refills > 11 THEN RAISE EXCEPTION 'Refills must be between 0 and 11'; END IF;
  IF NEW.days_supply IS NOT NULL AND (NEW.days_supply < 1 OR NEW.days_supply > 365) THEN RAISE EXCEPTION 'Days supply must be between 1 and 365'; END IF;
  IF coalesce(array_length(NEW.warnings,1),0) > 20 THEN RAISE EXCEPTION 'Too many warnings'; END IF;
  IF concat_ws(' ', NEW.drug_name, NEW.strength, NEW.dose, NEW.frequency, NEW.instructions, NEW.indication, NEW.override_reason) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN
    RAISE EXCEPTION 'Social Security numbers are not allowed';
  END IF;

  -- Server-side allergy check: a recorded allergy that matches the medicine name needs a written override.
  drug := lower(NEW.drug_name);
  SELECT EXISTS (
    SELECT 1 FROM (
      SELECT lower(trim(a)) AS allergen FROM unnest(coalesce(pallergies, '{}'::text[])) a
      UNION SELECT lower(trim(title)) FROM public.hc_pilot_records
        WHERE patient_id = NEW.patient_id AND record_type = 'allergy' AND status = 'active'
    ) s WHERE length(s.allergen) >= 3 AND (position(s.allergen IN drug) > 0 OR position(drug IN s.allergen) > 0)
  ) INTO allergy_hit;
  IF allergy_hit AND NOT ('allergy' = ANY(NEW.warnings)) THEN
    NEW.warnings := array_append(NEW.warnings, 'allergy');
  END IF;
  IF coalesce(array_length(NEW.warnings,1),0) > 0 AND length(coalesce(NEW.override_reason,'')) < 10 THEN
    RAISE EXCEPTION 'This prescription has a safety warning. Write why it is still right for this patient (at least 10 characters)';
  END IF;

  IF NEW.renewed_from IS NOT NULL THEN
    SELECT patient_id, status INTO prev FROM public.hc_pilot_prescriptions WHERE id = NEW.renewed_from;
    IF prev.patient_id IS DISTINCT FROM NEW.patient_id OR prev.status <> 'active' THEN
      RAISE EXCEPTION 'Only an active prescription for this patient can be renewed';
    END IF;
  END IF;
  NEW.created_at := now(); NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_prescriptions_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_prescriptions_validate();
CREATE TRIGGER hc_pilot_prescriptions_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

CREATE OR REPLACE FUNCTION public.hc_pilot_prescriptions_after()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE act text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.renewed_from IS NOT NULL THEN
      PERFORM set_config('hc.rx_renew', 'on', true);
      UPDATE public.hc_pilot_prescriptions SET status = 'renewed' WHERE id = NEW.renewed_from AND status = 'active';
      PERFORM set_config('hc.rx_renew', '', true);
      act := 'prescription_renewed';
    ELSE act := 'prescription_written'; END IF;
  ELSIF NEW.status = 'renewed' THEN RETURN NEW;
  ELSIF NEW.status = 'stopped' THEN act := 'prescription_stopped';
  ELSE act := 'prescription_marked_error'; END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, record_id, actor, actor_email, action)
  VALUES (NEW.clinic_id, NEW.patient_id, NEW.id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), act);
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_prescriptions_after AFTER INSERT OR UPDATE ON public.hc_pilot_prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_prescriptions_after();

-- ===== Lab orders =====
CREATE TABLE public.hc_pilot_lab_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  priority text NOT NULL DEFAULT 'routine',
  reason text,
  ordered_on date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'ordered',
  collected_at timestamptz,
  result_record_id uuid REFERENCES public.hc_pilot_records(id) ON DELETE SET NULL,
  cancel_reason text,
  ordered_by uuid NOT NULL DEFAULT auth.uid(),
  ordered_by_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_lab_orders TO authenticated;
GRANT ALL ON public.hc_pilot_lab_orders TO service_role;
ALTER TABLE public.hc_pilot_lab_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chart readers read pilot lab orders" ON public.hc_pilot_lab_orders FOR SELECT TO authenticated
  USING (public.hc_can_read_chart(clinic_id, patient_id));
CREATE POLICY "Doctors order pilot labs" ON public.hc_pilot_lab_orders FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor']) AND ordered_by = auth.uid());
CREATE POLICY "Clinicians update pilot lab orders" ON public.hc_pilot_lab_orders FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']));
CREATE INDEX hc_pilot_lab_orders_patient ON public.hc_pilot_lab_orders (clinic_id, patient_id, ordered_on DESC);

CREATE OR REPLACE FUNCTION public.hc_pilot_lab_orders_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pclinic uuid; rec record;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('resulted','cancelled') THEN RAISE EXCEPTION 'This lab order is closed'; END IF;
    IF NEW.status = 'collected' AND OLD.status = 'ordered' THEN
      NEW.collected_at := now();
      NEW.result_record_id := OLD.result_record_id; NEW.cancel_reason := OLD.cancel_reason;
    ELSIF NEW.status = 'resulted' AND OLD.status IN ('ordered','collected') THEN
      SELECT patient_id, clinic_id, record_type, status INTO rec FROM public.hc_pilot_records WHERE id = NEW.result_record_id;
      IF rec.patient_id IS DISTINCT FROM OLD.patient_id OR rec.clinic_id IS DISTINCT FROM OLD.clinic_id OR rec.record_type <> 'lab_result' OR rec.status <> 'active' THEN
        RAISE EXCEPTION 'Attach a lab result saved on this patient''s chart';
      END IF;
      NEW.collected_at := coalesce(OLD.collected_at, now()); NEW.cancel_reason := OLD.cancel_reason;
    ELSIF NEW.status = 'cancelled' AND OLD.status IN ('ordered','collected') THEN
      IF NOT public.hc_has_clinic_role(OLD.clinic_id, ARRAY['owner','doctor']) THEN RAISE EXCEPTION 'Only a doctor can cancel a lab order'; END IF;
      IF coalesce(length(trim(NEW.cancel_reason)),0) < 3 THEN RAISE EXCEPTION 'Give a reason for cancelling (at least 3 characters)'; END IF;
      IF NEW.cancel_reason ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
      NEW.cancel_reason := left(trim(NEW.cancel_reason), 300);
      NEW.collected_at := OLD.collected_at; NEW.result_record_id := OLD.result_record_id;
    ELSE
      RAISE EXCEPTION 'A lab order can only move from ordered to collected to resulted, or be cancelled';
    END IF;
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.test_name := OLD.test_name; NEW.priority := OLD.priority;
    NEW.reason := OLD.reason; NEW.ordered_on := OLD.ordered_on; NEW.ordered_by := OLD.ordered_by; NEW.ordered_by_email := OLD.ordered_by_email;
    NEW.created_at := OLD.created_at; NEW.updated_at := now();
    RETURN NEW;
  END IF;
  IF NOT public.hc_has_clinic_role(NEW.clinic_id, ARRAY['owner','doctor']) THEN RAISE EXCEPTION 'Only a doctor can order a lab test'; END IF;
  SELECT clinic_id INTO pclinic FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  NEW.status := 'ordered'; NEW.collected_at := NULL; NEW.result_record_id := NULL; NEW.cancel_reason := NULL;
  NEW.ordered_by := auth.uid(); NEW.ordered_by_email := nullif(auth.jwt() ->> 'email', '');
  NEW.ordered_on := coalesce(NEW.ordered_on, CURRENT_DATE);
  IF NEW.ordered_on > CURRENT_DATE + 1 OR NEW.ordered_on < CURRENT_DATE - 30 THEN RAISE EXCEPTION 'Order date must be within the last 30 days'; END IF;
  NEW.test_name := trim(NEW.test_name); NEW.reason := nullif(trim(coalesce(NEW.reason,'')), '');
  IF length(NEW.test_name) < 2 OR length(NEW.test_name) > 140 THEN RAISE EXCEPTION 'Test name is required (140 characters max)'; END IF;
  IF length(coalesce(NEW.reason,'')) > 300 THEN RAISE EXCEPTION 'Reason is too long (300 characters max)'; END IF;
  IF NEW.priority NOT IN ('routine','urgent','stat') THEN RAISE EXCEPTION 'Priority must be routine, urgent or STAT'; END IF;
  IF concat_ws(' ', NEW.test_name, NEW.reason) ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  NEW.created_at := now(); NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_lab_orders_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_lab_orders
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_lab_orders_validate();
CREATE TRIGGER hc_pilot_lab_orders_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_lab_orders
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

-- ===== Social-needs screening =====
CREATE TABLE public.hc_pilot_social_screenings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  screened_on date NOT NULL DEFAULT CURRENT_DATE,
  answers jsonb NOT NULL,
  positive_domains text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'active',
  error_reason text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_by_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hc_pilot_social_screenings TO authenticated;
GRANT ALL ON public.hc_pilot_social_screenings TO service_role;
ALTER TABLE public.hc_pilot_social_screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chart readers or screener read social screenings" ON public.hc_pilot_social_screenings FOR SELECT TO authenticated
  USING (public.hc_can_read_chart(clinic_id, patient_id) OR (created_by = auth.uid() AND public.hc_is_member(clinic_id)));
CREATE POLICY "Care team records social screenings" ON public.hc_pilot_social_screenings FOR INSERT TO authenticated
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse','front_desk']) AND created_by = auth.uid());
CREATE POLICY "Clinicians correct social screenings" ON public.hc_pilot_social_screenings FOR UPDATE TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']))
  WITH CHECK (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']));

CREATE OR REPLACE FUNCTION public.hc_pilot_social_screenings_validate()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE pclinic uuid; k text; v text; domains text[] := ARRAY['housing','food','transportation','utilities','safety']; pos text[] := '{}';
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'entered_in_error' THEN RAISE EXCEPTION 'This screening is already marked as entered in error'; END IF;
    IF NEW.status <> 'entered_in_error' OR coalesce(length(trim(NEW.error_reason)),0) < 3 THEN
      RAISE EXCEPTION 'A screening can only be marked as entered in error with a reason';
    END IF;
    NEW.error_reason := left(trim(NEW.error_reason), 300);
    NEW.clinic_id := OLD.clinic_id; NEW.patient_id := OLD.patient_id; NEW.screened_on := OLD.screened_on; NEW.answers := OLD.answers;
    NEW.positive_domains := OLD.positive_domains; NEW.notes := OLD.notes; NEW.created_by := OLD.created_by;
    NEW.created_by_email := OLD.created_by_email; NEW.created_at := OLD.created_at; NEW.updated_at := now();
    RETURN NEW;
  END IF;
  SELECT clinic_id INTO pclinic FROM public.hc_pilot_patients WHERE id = NEW.patient_id;
  IF pclinic IS NULL OR pclinic <> NEW.clinic_id THEN RAISE EXCEPTION 'Patient does not belong to this clinic'; END IF;
  IF jsonb_typeof(NEW.answers) <> 'object' THEN RAISE EXCEPTION 'Answers are required'; END IF;
  FOR k IN SELECT jsonb_object_keys(NEW.answers) LOOP
    IF NOT k = ANY(domains) THEN RAISE EXCEPTION 'Unknown screening question'; END IF;
  END LOOP;
  FOREACH k IN ARRAY domains LOOP
    v := NEW.answers ->> k;
    IF v IS NULL OR v NOT IN ('yes','no','declined') THEN RAISE EXCEPTION 'Answer every question (yes, no or declined)'; END IF;
    IF v = 'yes' THEN pos := array_append(pos, k); END IF;
  END LOOP;
  NEW.positive_domains := pos;
  NEW.status := 'active'; NEW.error_reason := NULL;
  NEW.created_by := auth.uid(); NEW.created_by_email := nullif(auth.jwt() ->> 'email', '');
  NEW.notes := nullif(trim(coalesce(NEW.notes,'')), '');
  IF length(coalesce(NEW.notes,'')) > 1000 THEN RAISE EXCEPTION 'Notes are too long (1,000 characters max)'; END IF;
  IF coalesce(NEW.notes,'') ~ '[0-9]{3}-[0-9]{2}-[0-9]{4}' THEN RAISE EXCEPTION 'Social Security numbers are not allowed'; END IF;
  IF NEW.screened_on > CURRENT_DATE + 1 OR NEW.screened_on < DATE '1900-01-01' THEN RAISE EXCEPTION 'Screening date must not be in the future'; END IF;
  NEW.created_at := now(); NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_social_screenings_validate BEFORE INSERT OR UPDATE ON public.hc_pilot_social_screenings
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_social_screenings_validate();
CREATE TRIGGER hc_pilot_social_screenings_real_lock BEFORE INSERT OR UPDATE ON public.hc_pilot_social_screenings
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_real_write_lock();

-- ===== Activity log for lab orders and screenings =====
CREATE OR REPLACE FUNCTION public.hc_pilot_orders_audit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE act text;
BEGIN
  IF TG_TABLE_NAME = 'hc_pilot_lab_orders' THEN
    act := CASE WHEN TG_OP = 'INSERT' THEN 'lab_ordered' WHEN NEW.status = 'collected' THEN 'lab_collected'
                WHEN NEW.status = 'resulted' THEN 'lab_resulted' ELSE 'lab_cancelled' END;
  ELSE
    act := CASE WHEN TG_OP = 'INSERT' THEN 'social_needs_screened' ELSE 'social_screening_marked_error' END;
  END IF;
  INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, record_id, actor, actor_email, action)
  VALUES (NEW.clinic_id, NEW.patient_id, NEW.id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), act);
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_lab_orders_audit AFTER INSERT OR UPDATE ON public.hc_pilot_lab_orders
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_orders_audit();
CREATE TRIGGER hc_pilot_social_screenings_audit AFTER INSERT OR UPDATE ON public.hc_pilot_social_screenings
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_orders_audit();

REVOKE ALL ON FUNCTION public.hc_pilot_prescriptions_after(), public.hc_pilot_orders_audit() FROM PUBLIC, anon, authenticated;