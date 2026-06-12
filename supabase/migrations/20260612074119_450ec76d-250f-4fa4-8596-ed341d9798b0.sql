
CREATE TABLE public.backlink_competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_domain text NOT NULL,
  competitor_domain text NOT NULL,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_domain, competitor_domain)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlink_competitors TO authenticated;
GRANT ALL ON public.backlink_competitors TO service_role;
ALTER TABLE public.backlink_competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage competitors" ON public.backlink_competitors
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.backlink_competitor_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_domain text NOT NULL,
  competitor_domain text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  authority_score numeric,
  total_backlinks bigint,
  referring_domains bigint,
  follow_backlinks bigint,
  nofollow_backlinks bigint,
  raw jsonb
);
CREATE INDEX ON public.backlink_competitor_snapshots (owner_domain, competitor_domain, captured_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlink_competitor_snapshots TO authenticated;
GRANT ALL ON public.backlink_competitor_snapshots TO service_role;
ALTER TABLE public.backlink_competitor_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read competitor snapshots" ON public.backlink_competitor_snapshots
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.backlink_gap_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_domain text NOT NULL,
  referring_domain text NOT NULL,
  ascore numeric,
  competitors text[] NOT NULL DEFAULT '{}',
  competitor_count int NOT NULL DEFAULT 0,
  last_seen date,
  computed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_domain, referring_domain)
);
CREATE INDEX ON public.backlink_gap_domains (owner_domain, competitor_count DESC, ascore DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlink_gap_domains TO authenticated;
GRANT ALL ON public.backlink_gap_domains TO service_role;
ALTER TABLE public.backlink_gap_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read gap" ON public.backlink_gap_domains
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
