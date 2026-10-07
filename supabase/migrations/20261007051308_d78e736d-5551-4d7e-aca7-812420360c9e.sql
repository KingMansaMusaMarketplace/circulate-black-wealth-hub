CREATE TABLE public.listing_review_claims (
  business_id uuid PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  claimed_by uuid NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_review_claims TO authenticated;
GRANT ALL ON public.listing_review_claims TO service_role;
ALTER TABLE public.listing_review_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can see review claims" ON public.listing_review_claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own claims" ON public.listing_review_claims FOR INSERT TO authenticated WITH CHECK (claimed_by = auth.uid());
CREATE POLICY "Users update own or expired claims" ON public.listing_review_claims FOR UPDATE TO authenticated
  USING (claimed_by = auth.uid() OR claimed_at < now() - interval '10 minutes') WITH CHECK (claimed_by = auth.uid());
CREATE POLICY "Users delete own claims" ON public.listing_review_claims FOR DELETE TO authenticated USING (claimed_by = auth.uid());