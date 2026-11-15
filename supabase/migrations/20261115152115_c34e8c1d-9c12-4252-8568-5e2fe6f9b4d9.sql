CREATE TABLE public.hc_pilot_video_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.hc_pilot_patients(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES public.hc_pilot_appointments(id) ON DELETE CASCADE,
  opened_by uuid NOT NULL,
  opened_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '2 hours',
  ended_at timestamptz,
  ended_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX hc_pilot_video_rooms_one_open ON public.hc_pilot_video_rooms(appointment_id) WHERE ended_at IS NULL;
CREATE INDEX hc_pilot_video_rooms_patient ON public.hc_pilot_video_rooms(patient_id, ended_at);
GRANT SELECT ON public.hc_pilot_video_rooms TO authenticated;
GRANT ALL ON public.hc_pilot_video_rooms TO service_role;
ALTER TABLE public.hc_pilot_video_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Care team or portal patient read video rooms" ON public.hc_pilot_video_rooms
  FOR SELECT TO authenticated
  USING (public.hc_has_clinic_role(clinic_id, ARRAY['owner','doctor','nurse']) OR public.hc_portal_patient(patient_id));
CREATE TRIGGER hc_pilot_video_rooms_updated_at BEFORE UPDATE ON public.hc_pilot_video_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Which side of an open room the caller is on: 'clinic', 'patient' or NULL (not allowed / closed).
CREATE OR REPLACE FUNCTION public.hc_pilot_video_side(_room uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL OR r.ended_at IS NOT NULL OR r.expires_at <= now() OR coalesce(p.is_real, true) THEN NULL
    WHEN public.hc_has_clinic_role(r.clinic_id, ARRAY['owner','doctor','nurse']) THEN 'clinic'
    WHEN public.hc_portal_patient(r.patient_id) THEN 'patient'
  END
  FROM public.hc_pilot_video_rooms r JOIN public.hc_pilot_patients p ON p.id = r.patient_id
  WHERE r.id = _room
$$;
REVOKE EXECUTE ON FUNCTION public.hc_pilot_video_side(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_pilot_video_side(uuid) TO authenticated;

CREATE TABLE public.hc_pilot_video_signals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.hc_pilot_video_rooms(id) ON DELETE CASCADE,
  sender_side text NOT NULL,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX hc_pilot_video_signals_room ON public.hc_pilot_video_signals(room_id, id);
GRANT SELECT, INSERT ON public.hc_pilot_video_signals TO authenticated;
GRANT ALL ON public.hc_pilot_video_signals TO service_role;
ALTER TABLE public.hc_pilot_video_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Room members read video signals" ON public.hc_pilot_video_signals
  FOR SELECT TO authenticated USING (public.hc_pilot_video_side(room_id) IS NOT NULL);
CREATE POLICY "Room members send video signals" ON public.hc_pilot_video_signals
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND sender_side = public.hc_pilot_video_side(room_id));

CREATE OR REPLACE FUNCTION public.hc_pilot_video_signals_validate()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.sender_side NOT IN ('clinic','patient') THEN RAISE EXCEPTION 'Unknown video side'; END IF;
  IF NEW.kind NOT IN ('hello','offer','answer','bye') THEN RAISE EXCEPTION 'Unknown video message'; END IF;
  IF NEW.kind = 'offer' AND NEW.sender_side <> 'clinic' THEN RAISE EXCEPTION 'Only the clinic starts the connection'; END IF;
  IF NEW.kind = 'answer' AND NEW.sender_side <> 'patient' THEN RAISE EXCEPTION 'Only the patient answers the connection'; END IF;
  IF NEW.kind IN ('hello','bye') THEN NEW.payload := NULL;
  ELSE
    IF NEW.payload IS NULL OR jsonb_typeof(NEW.payload) <> 'object' OR jsonb_typeof(NEW.payload -> 'sdp') <> 'string'
       OR (NEW.payload ->> 'type') NOT IN ('offer','answer') OR (NEW.payload ->> 'type') <> NEW.kind THEN
      RAISE EXCEPTION 'Video connection details are not valid';
    END IF;
    IF octet_length(NEW.payload::text) > 24000 THEN RAISE EXCEPTION 'Video connection details are too large'; END IF;
    NEW.payload := jsonb_build_object('type', NEW.payload ->> 'type', 'sdp', NEW.payload ->> 'sdp');
  END IF;
  IF (SELECT count(*) FROM public.hc_pilot_video_signals WHERE room_id = NEW.room_id) >= 400 THEN
    RAISE EXCEPTION 'This video room has reached its limit. End it and start a new video visit.';
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER hc_pilot_video_signals_validate BEFORE INSERT ON public.hc_pilot_video_signals
  FOR EACH ROW EXECUTE FUNCTION public.hc_pilot_video_signals_validate();

CREATE OR REPLACE FUNCTION public.hc_pilot_video_open(_appointment uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a record; r uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT ap.id, ap.clinic_id, ap.patient_id, ap.visit_type, ap.status, p.is_real
    INTO a FROM public.hc_pilot_appointments ap JOIN public.hc_pilot_patients p ON p.id = ap.patient_id
    WHERE ap.id = _appointment;
  IF a.id IS NULL OR NOT public.hc_has_clinic_role(a.clinic_id, ARRAY['owner','doctor','nurse']) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF coalesce(a.is_real, true) THEN RAISE EXCEPTION 'Video visits are for made-up test patients only until go-live review and a signed video agreement'; END IF;
  IF a.visit_type <> 'telehealth' THEN RAISE EXCEPTION 'Only Telehealth appointments can start a video visit'; END IF;
  IF a.status NOT IN ('scheduled','checked_in') THEN RAISE EXCEPTION 'This appointment is already closed'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('hc_pilot_video:' || _appointment::text));
  UPDATE public.hc_pilot_video_rooms SET ended_at = now() WHERE appointment_id = _appointment AND ended_at IS NULL AND expires_at <= now();
  SELECT id INTO r FROM public.hc_pilot_video_rooms WHERE appointment_id = _appointment AND ended_at IS NULL;
  IF r IS NULL THEN
    INSERT INTO public.hc_pilot_video_rooms(clinic_id, patient_id, appointment_id, opened_by)
      VALUES (a.clinic_id, a.patient_id, a.id, auth.uid()) RETURNING id INTO r;
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
      VALUES (a.clinic_id, a.patient_id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'video_visit_started');
  END IF;
  RETURN r;
END $$;
REVOKE EXECUTE ON FUNCTION public.hc_pilot_video_open(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_pilot_video_open(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.hc_pilot_video_end(_room uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT id, clinic_id, patient_id INTO r FROM public.hc_pilot_video_rooms WHERE id = _room;
  IF r.id IS NULL THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF public.hc_pilot_video_side(_room) IS NULL THEN
    -- Already ended or expired rooms end quietly; strangers are refused.
    IF public.hc_has_clinic_role(r.clinic_id, ARRAY['owner','doctor','nurse']) OR public.hc_portal_patient(r.patient_id) THEN RETURN; END IF;
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.hc_pilot_video_rooms SET ended_at = now(), ended_by = auth.uid() WHERE id = _room AND ended_at IS NULL;
  IF FOUND THEN
    INSERT INTO public.hc_pilot_audit(clinic_id, patient_id, actor, actor_email, action)
      VALUES (r.clinic_id, r.patient_id, auth.uid(), nullif(auth.jwt() ->> 'email', ''), 'video_visit_ended');
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.hc_pilot_video_end(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.hc_pilot_video_end(uuid) TO authenticated;