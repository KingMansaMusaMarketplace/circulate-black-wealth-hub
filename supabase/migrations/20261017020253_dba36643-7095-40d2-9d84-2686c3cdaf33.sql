REVOKE INSERT, UPDATE, DELETE ON public.hc_documents, public.hc_reviews FROM authenticated;
DROP POLICY IF EXISTS "hc members upload files" ON storage.objects;
CREATE TABLE public.hc_review_decisions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 clinic_id uuid NOT NULL REFERENCES public.hc_clinics(id) ON DELETE CASCADE,
 review_id uuid NOT NULL REFERENCES public.hc_reviews(id) ON DELETE CASCADE,
 reviewer_id uuid NOT NULL,
 decision text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hc_review_decisions TO authenticated;
GRANT ALL ON public.hc_review_decisions TO service_role;
ALTER TABLE public.hc_review_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic members read review decisions" ON public.hc_review_decisions FOR SELECT TO authenticated USING (public.hc_is_member(clinic_id));
CREATE INDEX ON public.hc_review_decisions(review_id, created_at);
CREATE OR REPLACE FUNCTION public.hc_validate_review_decision() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.decision NOT IN ('accepted','revision_requested') THEN RAISE EXCEPTION 'Invalid review decision'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.hc_reviews r WHERE r.id=NEW.review_id AND r.clinic_id=NEW.clinic_id) THEN RAISE EXCEPTION 'Review must belong to clinic'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.hc_members m WHERE m.clinic_id=NEW.clinic_id AND m.user_id=NEW.reviewer_id AND m.role IN ('owner','doctor')) THEN RAISE EXCEPTION 'Clinic reviewer required'; END IF;
 NEW.updated_at := now(); RETURN NEW;
END $$;
CREATE TRIGGER hc_review_decision_validation BEFORE INSERT OR UPDATE ON public.hc_review_decisions FOR EACH ROW EXECUTE FUNCTION public.hc_validate_review_decision();