
CREATE TABLE public.backlink_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  authority_score numeric,
  total_backlinks bigint,
  referring_domains bigint,
  referring_ips bigint,
  follow_backlinks bigint,
  nofollow_backlinks bigint,
  text_backlinks bigint,
  image_backlinks bigint,
  source text NOT NULL DEFAULT 'semrush',
  raw jsonb,
  created_by uuid
);
CREATE INDEX idx_backlink_snapshots_domain_time ON public.backlink_snapshots(domain, captured_at DESC);
GRANT SELECT ON public.backlink_snapshots TO authenticated;
GRANT ALL ON public.backlink_snapshots TO service_role;
ALTER TABLE public.backlink_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read backlink_snapshots" ON public.backlink_snapshots
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.backlink_referring_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.backlink_snapshots(id) ON DELETE CASCADE,
  domain text NOT NULL,
  referring_domain text NOT NULL,
  ascore numeric,
  backlinks_num bigint,
  ip_addresses_num bigint,
  country text,
  first_seen date,
  last_seen date,
  rank integer
);
CREATE INDEX idx_ref_domains_snapshot ON public.backlink_referring_domains(snapshot_id);
CREATE INDEX idx_ref_domains_domain_ref ON public.backlink_referring_domains(domain, referring_domain);
GRANT SELECT ON public.backlink_referring_domains TO authenticated;
GRANT ALL ON public.backlink_referring_domains TO service_role;
ALTER TABLE public.backlink_referring_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read referring_domains" ON public.backlink_referring_domains
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.backlink_anchors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.backlink_snapshots(id) ON DELETE CASCADE,
  domain text NOT NULL,
  anchor text NOT NULL,
  backlinks_num bigint,
  referring_domains_num bigint,
  first_seen date,
  last_seen date
);
CREATE INDEX idx_anchors_snapshot ON public.backlink_anchors(snapshot_id);
GRANT SELECT ON public.backlink_anchors TO authenticated;
GRANT ALL ON public.backlink_anchors TO service_role;
ALTER TABLE public.backlink_anchors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read backlink_anchors" ON public.backlink_anchors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
