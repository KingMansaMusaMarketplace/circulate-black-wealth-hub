CREATE TABLE public.hc_pilot_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
 requested_by uuid NOT NULL,
 clinic_baa_reported boolean NOT NULL DEFAULT false,
 vendor_baas_reported boolean NOT NULL DEFAULT false,
 attorney_review_reported boolean NOT NULL DEFAULT false,
 safeguards_reported boolean NOT NULL DEFAULT false,
 doctor_assigned_reported boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'awaiting_verification',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (clinic_id)
);
GRANT SELECT ON public.hc_pilot_requests TO authenticated;
GRANT ALL ON public.hc_pilot_requests TO service_role;
ALTER TABLE public.hc_pilot_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic members read pilot readiness" ON public.hc_pilot_requests FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE OR REPLACE FUNCTION public.hc_validate_pilot_request() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.status <> 'awaiting_verification' THEN RAISE EXCEPTION 'Real-record activation is unavailable in this environment'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.hc_members WHERE clinic_id=NEW.clinic_id AND user_id=NEW.requested_by AND role IN ('owner','doctor')) THEN RAISE EXCEPTION 'Clinic doctor or owner required'; END IF;
 NEW.updated_at := now();
 RETURN NEW;
END;
$$;
CREATE TRIGGER hc_pilot_request_validation BEFORE INSERT OR UPDATE ON public.hc_pilot_requests FOR EACH ROW EXECUTE FUNCTION public.hc_validate_pilot_request();
CREATE INDEX hc_pilot_requests_requested_by_idx ON public.hc_pilot_requests(requested_by);