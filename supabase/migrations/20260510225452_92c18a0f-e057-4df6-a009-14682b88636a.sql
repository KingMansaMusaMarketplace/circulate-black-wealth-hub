
CREATE TABLE public.featured_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  owner_user_id UUID NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze','silver','gold','platinum')),
  category TEXT,
  city TEXT,
  priority_score INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','expired','cancelled')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_featured_active ON public.featured_placements (status, ends_at) WHERE status = 'active';
CREATE INDEX idx_featured_category_city ON public.featured_placements (category, city, status);
CREATE INDEX idx_featured_business ON public.featured_placements (business_id);

ALTER TABLE public.featured_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active featured placements"
  ON public.featured_placements FOR SELECT
  USING (status = 'active' AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "Owners can view their placements"
  ON public.featured_placements FOR SELECT
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can insert their placements"
  ON public.featured_placements FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their placements"
  ON public.featured_placements FOR UPDATE
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Admins manage all featured placements"
  ON public.featured_placements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_featured_placements_updated_at
  BEFORE UPDATE ON public.featured_placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
