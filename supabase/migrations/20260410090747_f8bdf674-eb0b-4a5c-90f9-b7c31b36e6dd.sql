
-- Beta Testers registry
CREATE TABLE public.beta_testers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  beta_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'inactive', 'expired')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_by UUID REFERENCES auth.users(id),
  expiration_date TIMESTAMPTZ,
  notes TEXT,
  total_session_minutes NUMERIC DEFAULT 0,
  active_days_count INTEGER DEFAULT 0,
  feature_interactions_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.beta_testers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage beta testers"
  ON public.beta_testers FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Anyone can check beta status by email"
  ON public.beta_testers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Beta tester sessions
CREATE TABLE public.beta_tester_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_tester_id UUID NOT NULL REFERENCES public.beta_testers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end TIMESTAMPTZ,
  duration_minutes NUMERIC GENERATED ALWAYS AS (
    CASE WHEN session_end IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (session_end - session_start)) / 60.0
      ELSE NULL 
    END
  ) STORED
);

ALTER TABLE public.beta_tester_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage beta sessions"
  ON public.beta_tester_sessions FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Users can insert own sessions"
  ON public.beta_tester_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.beta_tester_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily activity tracking
CREATE TABLE public.beta_tester_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_tester_id UUID NOT NULL REFERENCES public.beta_testers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  page_views INTEGER DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  total_minutes NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(beta_tester_id, activity_date)
);

ALTER TABLE public.beta_tester_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage daily activity"
  ON public.beta_tester_daily_activity FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Users can insert own daily activity"
  ON public.beta_tester_daily_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily activity"
  ON public.beta_tester_daily_activity FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to activate beta tester when they sign up
CREATE OR REPLACE FUNCTION public.activate_beta_tester(p_email TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tester_id UUID;
BEGIN
  SELECT id INTO v_tester_id
  FROM public.beta_testers
  WHERE lower(email) = lower(p_email)
    AND status = 'invited'
    AND user_id IS NULL
    AND (expiration_date IS NULL OR expiration_date > now());

  IF v_tester_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.beta_testers
  SET user_id = p_user_id,
      status = 'active',
      signed_up_at = now(),
      updated_at = now()
  WHERE id = v_tester_id;

  RETURN TRUE;
END;
$$;

-- Function to check if email is a valid beta tester
CREATE OR REPLACE FUNCTION public.is_beta_tester(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.beta_testers
    WHERE lower(email) = lower(p_email)
      AND status IN ('invited', 'active')
      AND (expiration_date IS NULL OR expiration_date > now())
  );
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_beta_testers_updated_at
  BEFORE UPDATE ON public.beta_testers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
