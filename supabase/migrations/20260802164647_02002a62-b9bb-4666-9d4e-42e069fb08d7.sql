ALTER TABLE public.susu_escrow ADD COLUMN IF NOT EXISTS payment_reference text;

DELETE FROM public.susu_escrow a
USING public.susu_escrow b
WHERE a.ctid > b.ctid
  AND a.circle_id = b.circle_id
  AND a.round_number = b.round_number
  AND a.contributor_id = b.contributor_id;

CREATE UNIQUE INDEX IF NOT EXISTS susu_escrow_unique_contribution
  ON public.susu_escrow (circle_id, round_number, contributor_id);

ALTER TABLE public.susu_escrow ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='susu_escrow' LOOP
    EXECUTE format('DROP POLICY %I ON public.susu_escrow', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Members view their circle escrow"
ON public.susu_escrow FOR SELECT TO authenticated
USING (
  contributor_id = auth.uid()
  OR recipient_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.susu_memberships m
    WHERE m.circle_id = susu_escrow.circle_id AND m.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins manage escrow"
ON public.susu_escrow FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE INSERT, UPDATE, DELETE ON public.susu_escrow FROM authenticated, anon;
GRANT SELECT ON public.susu_escrow TO authenticated;
GRANT ALL ON public.susu_escrow TO service_role;