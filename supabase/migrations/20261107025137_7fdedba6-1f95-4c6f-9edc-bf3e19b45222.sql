CREATE TABLE public.hc_vendor_baas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL UNIQUE,
  service_used_for text NOT NULL,
  baa_category text NOT NULL DEFAULT 'requires_baa',
  status text NOT NULL DEFAULT 'not_requested',
  vendor_contact text,
  requested_on date,
  signed_on date,
  signed_by text,
  attorney_approved boolean NOT NULL DEFAULT false,
  plan_and_cost text,
  notes text,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT, INSERT, UPDATE ON public.hc_vendor_baas TO authenticated;
GRANT ALL ON public.hc_vendor_baas TO service_role;

ALTER TABLE public.hc_vendor_baas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read vendor BAA tracker"
  ON public.hc_vendor_baas FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins add vendor BAA rows"
  ON public.hc_vendor_baas FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update vendor BAA rows"
  ON public.hc_vendor_baas FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.hc_vendor_baas_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.baa_category NOT IN ('requires_baa', 'keep_phi_away') THEN
    RAISE EXCEPTION 'Invalid BAA category';
  END IF;
  IF NEW.status NOT IN ('not_requested', 'requested', 'draft_received', 'attorney_review', 'signed', 'vendor_declined', 'kept_away_from_patient_data') THEN
    RAISE EXCEPTION 'Invalid BAA status';
  END IF;
  -- Attorney approval only counts for an agreement that is actually signed.
  IF NEW.attorney_approved AND NEW.status <> 'signed' THEN
    NEW.attorney_approved := false;
  END IF;
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;

CREATE TRIGGER hc_vendor_baas_validate_trg
  BEFORE INSERT OR UPDATE ON public.hc_vendor_baas
  FOR EACH ROW EXECUTE FUNCTION public.hc_vendor_baas_validate();

INSERT INTO public.hc_vendor_baas (vendor_name, service_used_for, baa_category, status, sort_order) VALUES
  ('Supabase', 'Database, sign-in and file storage', 'requires_baa', 'not_requested', 10),
  ('Lovable', 'Website hosting and AI features', 'requires_baa', 'not_requested', 20),
  ('OpenAI', 'Voice conversations and AI writing', 'requires_baa', 'not_requested', 30),
  ('Resend', 'Sending emails', 'requires_baa', 'not_requested', 40),
  ('Twilio', 'Text messages and phone calls', 'requires_baa', 'not_requested', 50),
  ('ElevenLabs', 'Spoken voice', 'requires_baa', 'not_requested', 60),
  ('Perplexity', 'Web search for Kayla', 'keep_phi_away', 'not_requested', 70),
  ('Firecrawl', 'Reading public web pages', 'keep_phi_away', 'not_requested', 80),
  ('HeyGen', 'Marketing and briefing videos', 'keep_phi_away', 'not_requested', 90),
  ('Slack', 'Internal team alerts', 'keep_phi_away', 'not_requested', 100),
  ('Stripe', 'Subscription payments', 'keep_phi_away', 'not_requested', 110);