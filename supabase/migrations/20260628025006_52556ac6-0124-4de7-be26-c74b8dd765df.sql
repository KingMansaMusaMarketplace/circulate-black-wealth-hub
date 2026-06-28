
-- Split Stripe identifiers into owner/admin-only private tables

-- 1) featured_placements_private
CREATE TABLE IF NOT EXISTS public.featured_placements_private (
  placement_id uuid PRIMARY KEY REFERENCES public.featured_placements(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.featured_placements_private TO authenticated;
GRANT ALL ON public.featured_placements_private TO service_role;

ALTER TABLE public.featured_placements_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their placement stripe ids"
  ON public.featured_placements_private FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners manage their placement stripe ids"
  ON public.featured_placements_private FOR ALL
  TO authenticated
  USING (auth.uid() = owner_user_id OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = owner_user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Backfill from existing rows
INSERT INTO public.featured_placements_private (placement_id, owner_user_id, stripe_customer_id, stripe_subscription_id)
SELECT id, owner_user_id, stripe_customer_id, stripe_subscription_id
FROM public.featured_placements
WHERE stripe_customer_id IS NOT NULL OR stripe_subscription_id IS NOT NULL
ON CONFLICT (placement_id) DO NOTHING;

-- Drop the sensitive columns from the public table
ALTER TABLE public.featured_placements DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.featured_placements DROP COLUMN IF EXISTS stripe_subscription_id;


-- 2) job_postings_private for stripe_session_id
CREATE TABLE IF NOT EXISTS public.job_postings_private (
  job_id uuid PRIMARY KEY REFERENCES public.job_postings(id) ON DELETE CASCADE,
  poster_user_id uuid NOT NULL,
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_postings_private TO authenticated;
GRANT ALL ON public.job_postings_private TO service_role;

ALTER TABLE public.job_postings_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posters view their job stripe session"
  ON public.job_postings_private FOR SELECT
  TO authenticated
  USING (auth.uid() = poster_user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Posters manage their job stripe session"
  ON public.job_postings_private FOR ALL
  TO authenticated
  USING (auth.uid() = poster_user_id OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = poster_user_id OR has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.job_postings_private (job_id, poster_user_id, stripe_session_id)
SELECT id, poster_user_id, stripe_session_id
FROM public.job_postings
WHERE stripe_session_id IS NOT NULL
ON CONFLICT (job_id) DO NOTHING;

ALTER TABLE public.job_postings DROP COLUMN IF EXISTS stripe_session_id;
