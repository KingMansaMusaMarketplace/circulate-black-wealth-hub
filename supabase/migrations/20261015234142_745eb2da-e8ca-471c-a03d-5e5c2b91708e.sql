
CREATE TABLE public.hc_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, user_id)
);
CREATE TABLE public.hc_patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date,
  sex text,
  mrn text,
  payer text,
  conditions text[] NOT NULL DEFAULT '{}',
  allergies text[] NOT NULL DEFAULT '{}',
  risk text NOT NULL DEFAULT 'Low',
  notes text,
  is_sample boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  recorded_on date NOT NULL DEFAULT current_date,
  bp_sys int, bp_dia int, heart_rate int, weight_lb numeric, a1c numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  name text NOT NULL, dose text, status text NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  visit_date date NOT NULL DEFAULT current_date,
  visit_type text NOT NULL DEFAULT 'Office visit',
  provider text, note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  duration_min int NOT NULL DEFAULT 30,
  reason text, status text NOT NULL DEFAULT 'Scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.hc_patients(id) ON DELETE SET NULL,
  file_name text NOT NULL, storage_path text, pages int,
  status text NOT NULL DEFAULT 'uploaded',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES public.hc_documents(id) ON DELETE CASCADE,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_prior_auths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  service text NOT NULL, payer text, status text NOT NULL DEFAULT 'Draft',
  submitted_on date, decided_on date, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.hc_patients(id) ON DELETE CASCADE,
  cpt_code text, icd10_code text, description text,
  amount numeric NOT NULL DEFAULT 0, paid_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft', submitted_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['hc_clinics','hc_members','hc_patients','hc_vitals','hc_medications','hc_encounters','hc_appointments','hc_documents','hc_reviews','hc_prior_auths','hc_claims'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

CREATE INDEX ON public.hc_members(user_id);
CREATE INDEX ON public.hc_patients(clinic_id);
CREATE INDEX ON public.hc_appointments(clinic_id, starts_at);
CREATE INDEX ON public.hc_documents(clinic_id);

CREATE OR REPLACE FUNCTION public.hc_is_member(_clinic uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id = _clinic AND user_id = auth.uid())
$$;
CREATE OR REPLACE FUNCTION public.hc_is_owner(_clinic uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id = _clinic AND user_id = auth.uid() AND role = 'owner')
$$;
REVOKE EXECUTE ON FUNCTION public.hc_is_member(uuid), public.hc_is_owner(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_is_member(uuid), public.hc_is_owner(uuid) TO authenticated;

CREATE POLICY "Members read clinic" ON public.hc_clinics FOR SELECT TO authenticated USING (public.hc_is_member(id));
CREATE POLICY "Owner updates clinic" ON public.hc_clinics FOR UPDATE TO authenticated USING (public.hc_is_owner(id)) WITH CHECK (public.hc_is_owner(id));

CREATE POLICY "Members read team" ON public.hc_members FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE POLICY "Owner removes team" ON public.hc_members FOR DELETE TO authenticated USING (public.hc_is_owner(clinic_id) AND user_id <> auth.uid());

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['hc_patients','hc_vitals','hc_medications','hc_encounters','hc_appointments','hc_documents','hc_reviews','hc_prior_auths','hc_claims'] LOOP
    EXECUTE format('CREATE POLICY "Clinic members manage" ON public.%I FOR ALL TO authenticated USING (public.hc_is_member(clinic_id)) WITH CHECK (public.hc_is_member(clinic_id))', t);
  END LOOP;
END $$;

-- Guardrail: every patient row is sample data
CREATE OR REPLACE FUNCTION public.hc_force_sample()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.is_sample := true; NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER hc_patients_force_sample BEFORE INSERT OR UPDATE ON public.hc_patients FOR EACH ROW EXECUTE FUNCTION public.hc_force_sample();

CREATE OR REPLACE FUNCTION public.hc_touch()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER t1 BEFORE UPDATE ON public.hc_clinics FOR EACH ROW EXECUTE FUNCTION public.hc_touch();
CREATE TRIGGER t2 BEFORE UPDATE ON public.hc_appointments FOR EACH ROW EXECUTE FUNCTION public.hc_touch();
CREATE TRIGGER t3 BEFORE UPDATE ON public.hc_documents FOR EACH ROW EXECUTE FUNCTION public.hc_touch();
CREATE TRIGGER t4 BEFORE UPDATE ON public.hc_prior_auths FOR EACH ROW EXECUTE FUNCTION public.hc_touch();
CREATE TRIGGER t5 BEFORE UPDATE ON public.hc_claims FOR EACH ROW EXECUTE FUNCTION public.hc_touch();

-- Create a clinic + owner seat + fictional sample data
CREATE OR REPLACE FUNCTION public.hc_create_clinic(_name text, _specialty text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c uuid; p1 uuid; p2 uuid; p3 uuid; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF coalesce(length(trim(_name)),0) < 2 OR length(_name) > 120 THEN RAISE EXCEPTION 'Clinic name required'; END IF;
  INSERT INTO hc_clinics(name, specialty, created_by) VALUES (trim(_name), _specialty, uid) RETURNING id INTO c;
  INSERT INTO hc_members(clinic_id, user_id, role, email) VALUES (c, uid, 'owner', (SELECT email FROM auth.users WHERE id = uid));

  INSERT INTO hc_patients(clinic_id, first_name, last_name, dob, sex, mrn, payer, conditions, allergies, risk)
    VALUES (c,'Jordan','Sample','1972-03-14','M','DEMO-10021','Sample Health PPO', ARRAY['Type 2 diabetes','Hypertension','Lumbar disc herniation L4-L5'], ARRAY['Penicillin'],'High') RETURNING id INTO p1;
  INSERT INTO hc_patients(clinic_id, first_name, last_name, dob, sex, mrn, payer, conditions, allergies, risk)
    VALUES (c,'Avery','Example','1959-08-02','F','DEMO-10044','Sample Medicare Advantage', ARRAY['Congestive heart failure','Chronic kidney disease stage 3'], ARRAY['None known'],'High') RETURNING id INTO p2;
  INSERT INTO hc_patients(clinic_id, first_name, last_name, dob, sex, mrn, payer, conditions, allergies, risk)
    VALUES (c,'Morgan','Placeholder','1988-11-21','F','DEMO-10087','Sample Commercial HMO', ARRAY['Cervical strain','Migraine'], ARRAY['Sulfa'],'Moderate') RETURNING id INTO p3;

  INSERT INTO hc_vitals(clinic_id, patient_id, recorded_on, bp_sys, bp_dia, heart_rate, weight_lb, a1c) VALUES
    (c,p1,current_date-100,148,94,82,231,8.4),(c,p1,current_date-60,139,88,78,226,7.9),(c,p1,current_date-20,131,84,74,221,7.3),
    (c,p2,current_date-75,136,80,88,172,NULL),(c,p2,current_date-45,128,78,80,168,NULL),(c,p2,current_date-14,124,76,76,166,NULL),
    (c,p3,current_date-30,118,74,70,142,NULL);
  INSERT INTO hc_medications(clinic_id, patient_id, name, dose, status) VALUES
    (c,p1,'Metformin','1000 mg twice daily','Active'),(c,p1,'Lisinopril','20 mg daily','Active'),(c,p1,'Gabapentin','300 mg nightly','Review'),
    (c,p2,'Furosemide','40 mg daily','Active'),(c,p2,'Carvedilol','12.5 mg twice daily','Active'),
    (c,p3,'Sumatriptan','50 mg as needed','Active');
  INSERT INTO hc_encounters(clinic_id, patient_id, visit_date, visit_type, provider, note) VALUES
    (c,p1,current_date-340,'ER visit','Sample General ER','Low back pain after motor-vehicle collision (sample).'),
    (c,p1,current_date-300,'MRI','Sample Imaging Center','L4-L5 disc protrusion, mild nerve contact (sample).'),
    (c,p1,current_date-240,'Surgery','Sample Spine Institute','Microdiscectomy L4-L5 (sample).'),
    (c,p2,current_date-120,'Hospital stay','Sample Heart Hospital','Fluid overload, 3 nights (sample).'),
    (c,p3,current_date-50,'Office visit','Sample Neurology','Neck pain and headaches after fall (sample).');
  INSERT INTO hc_appointments(clinic_id, patient_id, starts_at, duration_min, reason, status) VALUES
    (c,p1,date_trunc('day',now())+interval '9 hours',45,'CME (Compulsory Medical Examination) exam','Scheduled'),
    (c,p2,date_trunc('day',now())+interval '10 hours 30 minutes',30,'Heart-failure follow-up','Scheduled'),
    (c,p3,date_trunc('day',now())+interval '13 hours',30,'Headache review','Scheduled'),
    (c,p1,date_trunc('day',now())+interval '1 day 11 hours',30,'Diabetes check','Scheduled');
  INSERT INTO hc_prior_auths(clinic_id, patient_id, service, payer, status, submitted_on, notes) VALUES
    (c,p1,'Lumbar MRI with contrast','Sample Health PPO','Pending',current_date-3,'Sample request'),
    (c,p2,'Cardiac rehab, 12 sessions','Sample Medicare Advantage','Approved',current_date-10,'Sample request'),
    (c,p3,'Physical therapy, 8 sessions','Sample Commercial HMO','Draft',NULL,'Sample request');
  INSERT INTO hc_claims(clinic_id, patient_id, cpt_code, icd10_code, description, amount, paid_amount, status, submitted_on) VALUES
    (c,p1,'99204','M51.26','New patient visit (sample)',285,0,'Submitted',current_date-5),
    (c,p2,'99214','I50.9','Follow-up visit (sample)',165,132,'Paid',current_date-21),
    (c,p3,'99213','S13.4XXA','Office visit (sample)',120,0,'Denied',current_date-12);
  RETURN c;
END $$;

CREATE OR REPLACE FUNCTION public.hc_add_member(_clinic uuid, _email text, _role text DEFAULT 'staff')
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target uuid;
BEGIN
  IF NOT public.hc_is_owner(_clinic) THEN RAISE EXCEPTION 'Only the clinic owner can add team members'; END IF;
  IF _role NOT IN ('doctor','staff') THEN RAISE EXCEPTION 'Role must be doctor or staff'; END IF;
  SELECT id INTO target FROM auth.users WHERE lower(email) = lower(trim(_email)) LIMIT 1;
  IF target IS NULL THEN RETURN 'not_found'; END IF;
  INSERT INTO hc_members(clinic_id, user_id, role, email) VALUES (_clinic, target, _role, lower(trim(_email)))
    ON CONFLICT (clinic_id, user_id) DO UPDATE SET role = EXCLUDED.role;
  RETURN 'added';
END $$;
REVOKE EXECUTE ON FUNCTION public.hc_create_clinic(text,text), public.hc_add_member(uuid,text,text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_create_clinic(text,text), public.hc_add_member(uuid,text,text) TO authenticated;

-- Storage policies for sample record files (bucket created separately)
CREATE POLICY "hc members read files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'hc-sample-docs' AND public.hc_is_member(((storage.foldername(name))[1])::uuid));
CREATE POLICY "hc members upload files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'hc-sample-docs' AND public.hc_is_member(((storage.foldername(name))[1])::uuid));
CREATE POLICY "hc members delete files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'hc-sample-docs' AND public.hc_is_member(((storage.foldername(name))[1])::uuid));
