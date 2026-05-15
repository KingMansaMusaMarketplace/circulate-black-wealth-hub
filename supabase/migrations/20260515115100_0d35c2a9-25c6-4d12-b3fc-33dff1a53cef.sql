CREATE TABLE IF NOT EXISTS public.partner_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INT NOT NULL DEFAULT 1,
  steps_completed TEXT[] NOT NULL DEFAULT '{}',
  step_timestamps JSONB NOT NULL DEFAULT '{}'::jsonb,
  goals JSONB NOT NULL DEFAULT '{}'::jsonb,
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  resources_viewed BOOLEAN NOT NULL DEFAULT false,
  first_link_generated BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_onboarding_user ON public.partner_onboarding_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_step ON public.partner_onboarding_progress (current_step);
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_completed ON public.partner_onboarding_progress (completed_at);

ALTER TABLE public.partner_onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners view own onboarding"
  ON public.partner_onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners insert own onboarding"
  ON public.partner_onboarding_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners update own onboarding"
  ON public.partner_onboarding_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_partner_onboarding_updated_at
  BEFORE UPDATE ON public.partner_onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();