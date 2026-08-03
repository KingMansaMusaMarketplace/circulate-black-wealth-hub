
-- 1. Email-based leadership seats
ALTER TABLE public.enterprise_org_leaders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.enterprise_org_leaders ADD COLUMN IF NOT EXISTS invite_email text;
ALTER TABLE public.enterprise_org_leaders ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS enterprise_org_leaders_org_invite_email_idx
  ON public.enterprise_org_leaders (org_id, lower(invite_email))
  WHERE invite_email IS NOT NULL;

ALTER TABLE public.enterprise_org_leaders
  DROP CONSTRAINT IF EXISTS enterprise_org_leaders_identity_chk;
ALTER TABLE public.enterprise_org_leaders
  ADD CONSTRAINT enterprise_org_leaders_identity_chk
  CHECK (user_id IS NOT NULL OR invite_email IS NOT NULL);

-- 2. Seat claiming (verified email only)
CREATE OR REPLACE FUNCTION public.claim_enterprise_leader_seats()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_confirmed timestamptz;
  v_count integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 0;
  END IF;

  SELECT u.email, u.email_confirmed_at INTO v_email, v_confirmed
  FROM auth.users u WHERE u.id = auth.uid();

  IF v_email IS NULL OR v_confirmed IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.enterprise_org_leaders
     SET user_id = auth.uid(),
         claimed_at = now(),
         updated_at = now()
   WHERE user_id IS NULL
     AND invite_email IS NOT NULL
     AND lower(invite_email) = lower(v_email)
     AND is_active = true;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_enterprise_leader_seats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_enterprise_leader_seats() TO authenticated;

-- 3. Partner leaders may complete their own onboarding tasks
DROP POLICY IF EXISTS "Org leaders can complete their own tasks" ON public.enterprise_org_onboarding_tasks;
CREATE POLICY "Org leaders can complete their own tasks"
ON public.enterprise_org_onboarding_tasks
FOR UPDATE
TO authenticated
USING (is_org_leader(auth.uid(), org_id) AND owner_side = 'partner')
WITH CHECK (is_org_leader(auth.uid(), org_id) AND owner_side = 'partner');

GRANT UPDATE ON public.enterprise_org_onboarding_tasks TO authenticated;

-- Lock down which columns partner leaders may change on tasks
CREATE OR REPLACE FUNCTION public.enforce_org_task_leader_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.org_id := OLD.org_id;
  NEW.week_number := OLD.week_number;
  NEW.division := OLD.division;
  NEW.title := OLD.title;
  NEW.description := OLD.description;
  NEW.owner_side := OLD.owner_side;
  NEW.due_date := OLD.due_date;
  NEW.sort_order := OLD.sort_order;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_org_task_leader_cols_trg ON public.enterprise_org_onboarding_tasks;
CREATE TRIGGER enforce_org_task_leader_cols_trg
BEFORE UPDATE ON public.enterprise_org_onboarding_tasks
FOR EACH ROW EXECUTE FUNCTION public.enforce_org_task_leader_cols();

-- 4. Revenue-share recorder for partner-attributed businesses
CREATE OR REPLACE FUNCTION public.record_enterprise_revenue_share(
  _business_id uuid,
  _gross_amount_cents integer,
  _event_type text DEFAULT 'subscription',
  _description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_pct numeric;
  v_id uuid;
BEGIN
  SELECT m.org_id INTO v_org_id
  FROM public.enterprise_org_members m
  WHERE m.business_id = _business_id
  ORDER BY m.created_at ASC
  LIMIT 1;

  IF v_org_id IS NULL OR COALESCE(_gross_amount_cents, 0) <= 0 THEN
    RETURN NULL;
  END IF;

  SELECT o.revenue_share_pct INTO v_pct FROM public.enterprise_orgs o WHERE o.id = v_org_id;
  v_pct := COALESCE(v_pct, 0);

  INSERT INTO public.enterprise_org_revenue_events
    (org_id, event_type, description, gross_amount_cents, share_pct, share_amount_cents, occurred_at)
  VALUES
    (v_org_id, _event_type, _description, _gross_amount_cents, v_pct,
     ROUND(_gross_amount_cents * v_pct / 100.0)::int, now())
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_enterprise_revenue_share(uuid, integer, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_enterprise_revenue_share(uuid, integer, text, text) TO service_role;
