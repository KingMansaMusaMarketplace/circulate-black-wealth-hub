-- ============ Mansa Stays Beta System ============

-- 1) Stays Beta Testers registry
CREATE TABLE public.stays_beta_testers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  beta_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'inactive', 'expired')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_by UUID REFERENCES auth.users(id),
  expiration_date TIMESTAMPTZ DEFAULT '2027-01-01 00:00:00+00',
  notes TEXT,
  total_session_minutes NUMERIC DEFAULT 0,
  active_days_count INTEGER DEFAULT 0,
  properties_viewed INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  feedback_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stays_beta_testers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage stays beta testers"
  ON public.stays_beta_testers FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Anyone can check stays beta status"
  ON public.stays_beta_testers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_stays_beta_testers_updated_at
  BEFORE UPDATE ON public.stays_beta_testers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Sessions
CREATE TABLE public.stays_beta_tester_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_tester_id UUID NOT NULL REFERENCES public.stays_beta_testers(id) ON DELETE CASCADE,
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

ALTER TABLE public.stays_beta_tester_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage stays beta sessions"
  ON public.stays_beta_tester_sessions FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Users insert own stays sessions"
  ON public.stays_beta_tester_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own stays sessions"
  ON public.stays_beta_tester_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3) Daily activity
CREATE TABLE public.stays_beta_tester_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_tester_id UUID NOT NULL REFERENCES public.stays_beta_testers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  page_views INTEGER DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  total_minutes NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(beta_tester_id, activity_date)
);

ALTER TABLE public.stays_beta_tester_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage stays daily activity"
  ON public.stays_beta_tester_daily_activity FOR ALL
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Users insert own stays daily activity"
  ON public.stays_beta_tester_daily_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own stays daily activity"
  ON public.stays_beta_tester_daily_activity FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4) Feedback inbox
CREATE TABLE public.stays_beta_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_tester_id UUID REFERENCES public.stays_beta_testers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  page_url TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stays_beta_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read all stays feedback"
  ON public.stays_beta_feedback FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

CREATE POLICY "Users submit own stays feedback"
  ON public.stays_beta_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own stays feedback"
  ON public.stays_beta_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 5) Activation function
CREATE OR REPLACE FUNCTION public.activate_stays_beta_tester(p_email TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tester_id UUID;
BEGIN
  SELECT id INTO v_tester_id
  FROM public.stays_beta_testers
  WHERE lower(email) = lower(p_email)
    AND status = 'invited'
    AND user_id IS NULL
    AND (expiration_date IS NULL OR expiration_date > now());

  IF v_tester_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.stays_beta_testers
  SET user_id = p_user_id,
      status = 'active',
      signed_up_at = now(),
      updated_at = now()
  WHERE id = v_tester_id;

  RETURN TRUE;
END;
$$;

-- 6) Check function
CREATE OR REPLACE FUNCTION public.is_stays_beta_tester(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.stays_beta_testers
    WHERE lower(email) = lower(p_email)
      AND status IN ('invited', 'active')
      AND (expiration_date IS NULL OR expiration_date > now())
  );
$$;

-- 7) Auto-activate on profile create/update
CREATE OR REPLACE FUNCTION public.auto_activate_stays_beta_tester()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    UPDATE public.stays_beta_testers
    SET status = 'active',
        user_id = NEW.id,
        signed_up_at = COALESCE(signed_up_at, now())
    WHERE lower(email) = lower(NEW.email)
      AND status = 'invited';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_activate_stays_beta_tester ON public.profiles;
CREATE TRIGGER trg_auto_activate_stays_beta_tester
AFTER INSERT OR UPDATE OF email ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_activate_stays_beta_tester();