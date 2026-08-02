-- =========================================================
-- Enterprise Organization layer
-- =========================================================

CREATE TABLE public.enterprise_orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  tagline text,
  website_url text,
  logo_url text,
  primary_color text NOT NULL DEFAULT '#003366',
  accent_color text NOT NULL DEFAULT '#FFB300',
  invite_code text UNIQUE,
  revenue_share_pct numeric(5,2) NOT NULL DEFAULT 20.00,
  status text NOT NULL DEFAULT 'onboarding',
  is_public boolean NOT NULL DEFAULT false,
  launch_date date,
  term_years integer NOT NULL DEFAULT 5,
  member_reach bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.enterprise_orgs TO anon;
GRANT SELECT ON public.enterprise_orgs TO authenticated;
GRANT ALL ON public.enterprise_orgs TO service_role;

ALTER TABLE public.enterprise_orgs ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Chapters
-- =========================================================

CREATE TABLE public.enterprise_org_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.enterprise_orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  city text,
  state text,
  contact_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_chapters_org ON public.enterprise_org_chapters(org_id);

GRANT SELECT ON public.enterprise_org_chapters TO anon;
GRANT SELECT ON public.enterprise_org_chapters TO authenticated;
GRANT ALL ON public.enterprise_org_chapters TO service_role;

ALTER TABLE public.enterprise_org_chapters ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Members
-- =========================================================

CREATE TABLE public.enterprise_org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.enterprise_orgs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  chapter_id uuid REFERENCES public.enterprise_org_chapters(id) ON DELETE SET NULL,
  member_type text NOT NULL DEFAULT 'member',
  source text NOT NULL DEFAULT 'landing_page',
  business_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX idx_org_members_org ON public.enterprise_org_members(org_id);
CREATE INDEX idx_org_members_user ON public.enterprise_org_members(user_id);

GRANT SELECT, INSERT, UPDATE ON public.enterprise_org_members TO authenticated;
GRANT ALL ON public.enterprise_org_members TO service_role;

ALTER TABLE public.enterprise_org_members ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Leaders
-- =========================================================

CREATE TABLE public.enterprise_org_leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.enterprise_orgs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text,
  title text NOT NULL,
  division text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX idx_org_leaders_org ON public.enterprise_org_leaders(org_id);
CREATE INDEX idx_org_leaders_user ON public.enterprise_org_leaders(user_id);

GRANT SELECT ON public.enterprise_org_leaders TO authenticated;
GRANT ALL ON public.enterprise_org_leaders TO service_role;

ALTER TABLE public.enterprise_org_leaders ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Security definer helpers
-- =========================================================

CREATE OR REPLACE FUNCTION public.is_org_leader(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enterprise_org_leaders l
    WHERE l.user_id = _user_id
      AND l.org_id = _org_id
      AND l.is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enterprise_org_members m
    WHERE m.user_id = _user_id
      AND m.org_id = _org_id
  )
$$;

-- =========================================================
-- Revenue ledger
-- =========================================================

CREATE TABLE public.enterprise_org_revenue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.enterprise_orgs(id) ON DELETE CASCADE,
  business_id uuid,
  user_id uuid,
  event_type text NOT NULL DEFAULT 'subscription',
  description text,
  gross_amount_cents bigint NOT NULL DEFAULT 0,
  share_pct numeric(5,2) NOT NULL DEFAULT 20.00,
  share_amount_cents bigint NOT NULL DEFAULT 0,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_rev_org ON public.enterprise_org_revenue_events(org_id, occurred_at DESC);

GRANT SELECT ON public.enterprise_org_revenue_events TO authenticated;
GRANT ALL ON public.enterprise_org_revenue_events TO service_role;

ALTER TABLE public.enterprise_org_revenue_events ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Onboarding tasks
-- =========================================================

CREATE TABLE public.enterprise_org_onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.enterprise_orgs(id) ON DELETE CASCADE,
  week_number integer NOT NULL DEFAULT 1,
  division text,
  title text NOT NULL,
  description text,
  owner_side text NOT NULL DEFAULT '1325',
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  completed_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_onboarding_org ON public.enterprise_org_onboarding_tasks(org_id, week_number, sort_order);

GRANT SELECT ON public.enterprise_org_onboarding_tasks TO authenticated;
GRANT ALL ON public.enterprise_org_onboarding_tasks TO service_role;

ALTER TABLE public.enterprise_org_onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Policies
-- =========================================================

-- Orgs
CREATE POLICY "Public can view public orgs"
  ON public.enterprise_orgs FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Org leaders can view their org"
  ON public.enterprise_orgs FOR SELECT TO authenticated
  USING (public.is_org_leader(auth.uid(), id));

CREATE POLICY "Admins manage orgs"
  ON public.enterprise_orgs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Chapters
CREATE POLICY "Public can view chapters of public orgs"
  ON public.enterprise_org_chapters FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.enterprise_orgs o WHERE o.id = org_id AND o.is_public = true));

CREATE POLICY "Org leaders can view chapters"
  ON public.enterprise_org_chapters FOR SELECT TO authenticated
  USING (public.is_org_leader(auth.uid(), org_id));

CREATE POLICY "Admins manage chapters"
  ON public.enterprise_org_chapters FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Members
CREATE POLICY "Users can view their own membership"
  ON public.enterprise_org_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Org leaders can view org members"
  ON public.enterprise_org_members FOR SELECT TO authenticated
  USING (public.is_org_leader(auth.uid(), org_id));

CREATE POLICY "Admins can view all org members"
  ON public.enterprise_org_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can join an org as themselves"
  ON public.enterprise_org_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own membership"
  ON public.enterprise_org_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage org members"
  ON public.enterprise_org_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Leaders
CREATE POLICY "Leaders can view their org leadership"
  ON public.enterprise_org_leaders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_org_leader(auth.uid(), org_id));

CREATE POLICY "Admins manage org leaders"
  ON public.enterprise_org_leaders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Revenue
CREATE POLICY "Org leaders can view revenue ledger"
  ON public.enterprise_org_revenue_events FOR SELECT TO authenticated
  USING (public.is_org_leader(auth.uid(), org_id));

CREATE POLICY "Admins manage revenue ledger"
  ON public.enterprise_org_revenue_events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Onboarding
CREATE POLICY "Org leaders can view onboarding tasks"
  ON public.enterprise_org_onboarding_tasks FOR SELECT TO authenticated
  USING (public.is_org_leader(auth.uid(), org_id));

CREATE POLICY "Admins manage onboarding tasks"
  ON public.enterprise_org_onboarding_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- updated_at triggers
-- =========================================================

CREATE TRIGGER trg_enterprise_orgs_updated BEFORE UPDATE ON public.enterprise_orgs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_org_chapters_updated BEFORE UPDATE ON public.enterprise_org_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_org_members_updated BEFORE UPDATE ON public.enterprise_org_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_org_leaders_updated BEFORE UPDATE ON public.enterprise_org_leaders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_org_revenue_updated BEFORE UPDATE ON public.enterprise_org_revenue_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_org_onboarding_updated BEFORE UPDATE ON public.enterprise_org_onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Guard: members cannot promote themselves to leader-only fields
-- =========================================================

CREATE OR REPLACE FUNCTION public.protect_enterprise_org_member_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  NEW.org_id := OLD.org_id;
  NEW.user_id := OLD.user_id;
  NEW.source := OLD.source;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_org_member_cols BEFORE UPDATE ON public.enterprise_org_members
  FOR EACH ROW EXECUTE FUNCTION public.protect_enterprise_org_member_cols();