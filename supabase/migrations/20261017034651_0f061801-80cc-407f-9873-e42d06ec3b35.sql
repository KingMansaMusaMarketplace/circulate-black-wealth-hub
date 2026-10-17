CREATE TABLE public.hc_visit_notes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
 sample_visit_id text NOT NULL,
 model text NOT NULL,
 note jsonb NOT NULL,
 created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hc_visit_notes TO authenticated;
GRANT ALL ON public.hc_visit_notes TO service_role;
ALTER TABLE public.hc_visit_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic members read visit notes" ON public.hc_visit_notes FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE INDEX ON public.hc_visit_notes(clinic_id, created_at DESC);

CREATE TABLE public.hc_note_signoffs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
 note_id uuid NOT NULL REFERENCES public.hc_visit_notes(id) ON DELETE CASCADE,
 signer_id uuid NOT NULL,
 decision text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hc_note_signoffs TO authenticated;
GRANT ALL ON public.hc_note_signoffs TO service_role;
ALTER TABLE public.hc_note_signoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic members read note signoffs" ON public.hc_note_signoffs FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE INDEX ON public.hc_note_signoffs(note_id, created_at);

CREATE OR REPLACE FUNCTION public.hc_validate_note_signoff() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.decision NOT IN ('signed','rejected') THEN RAISE EXCEPTION 'Invalid note decision'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.hc_visit_notes n WHERE n.id=NEW.note_id AND n.clinic_id=NEW.clinic_id) THEN RAISE EXCEPTION 'Note must belong to clinic'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.hc_members m WHERE m.clinic_id=NEW.clinic_id AND m.user_id=NEW.signer_id AND m.role IN ('owner','doctor')) THEN RAISE EXCEPTION 'Clinic doctor required'; END IF;
 IF EXISTS (SELECT 1 FROM public.hc_note_signoffs s WHERE s.note_id=NEW.note_id) THEN RAISE EXCEPTION 'This note already has a decision'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER hc_note_signoff_validation BEFORE INSERT ON public.hc_note_signoffs FOR EACH ROW EXECUTE FUNCTION public.hc_validate_note_signoff();