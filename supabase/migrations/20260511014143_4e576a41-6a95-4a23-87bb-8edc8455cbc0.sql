
-- Verification Fast-Track columns
ALTER TABLE public.business_verifications
  ADD COLUMN IF NOT EXISTS priority_tier text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS priority_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS priority_stripe_session_id text,
  ADD COLUMN IF NOT EXISTS priority_sla_deadline timestamptz;

ALTER TABLE public.business_verifications
  ADD CONSTRAINT business_verifications_priority_tier_check
    CHECK (priority_tier IN ('standard','priority','same_day'));

CREATE INDEX IF NOT EXISTS idx_business_verifications_priority_sla
  ON public.business_verifications (priority_sla_deadline)
  WHERE verification_status = 'pending' AND priority_tier <> 'standard';

-- Audit table for fast-track payments
CREATE TABLE IF NOT EXISTS public.verification_priority_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  verification_id uuid,
  user_id uuid NOT NULL,
  tier text NOT NULL CHECK (tier IN ('priority','same_day')),
  amount_cents integer NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_priority_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all priority payments"
  ON public.verification_priority_payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can view their own priority payments"
  ON public.verification_priority_payments FOR SELECT
  USING (user_id = auth.uid());

-- ===========================================================
-- Marketing Studio credits
-- ===========================================================
CREATE TABLE IF NOT EXISTS public.marketing_credits (
  business_id uuid PRIMARY KEY,
  plan_credits_remaining integer NOT NULL DEFAULT 0,
  topup_credits_remaining integer NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL DEFAULT now(),
  period_end timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  current_tier text NOT NULL DEFAULT 'free',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their marketing credits"
  ON public.marketing_credits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = marketing_credits.business_id AND b.owner_id = auth.uid()
  ));

CREATE POLICY "Admins can view all marketing credits"
  ON public.marketing_credits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.marketing_credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  delta integer NOT NULL,
  bucket text NOT NULL CHECK (bucket IN ('plan','topup')),
  reason text NOT NULL CHECK (reason IN ('generation','topup','monthly_refill','admin_grant','refund')),
  stripe_session_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_credit_ledger_business
  ON public.marketing_credit_ledger (business_id, created_at DESC);

ALTER TABLE public.marketing_credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their ledger"
  ON public.marketing_credit_ledger FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = marketing_credit_ledger.business_id AND b.owner_id = auth.uid()
  ));

CREATE POLICY "Admins can view all ledger entries"
  ON public.marketing_credit_ledger FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Plan tier -> monthly allocation
CREATE OR REPLACE FUNCTION public.marketing_credits_monthly_allocation(p_tier text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE lower(coalesce(p_tier,'free'))
    WHEN 'enterprise' THEN 200
    WHEN 'business'   THEN 200
    WHEN 'pro'        THEN 50
    WHEN 'premium'    THEN 50
    WHEN 'basic'      THEN 5
    ELSE 5
  END;
$$;

-- Atomic consume RPC
CREATE OR REPLACE FUNCTION public.consume_marketing_credit(p_business_id uuid, p_tier text DEFAULT 'free')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.marketing_credits%ROWTYPE;
  v_alloc integer;
  v_bucket text;
BEGIN
  v_alloc := public.marketing_credits_monthly_allocation(p_tier);

  -- Ensure row exists
  INSERT INTO public.marketing_credits (business_id, plan_credits_remaining, current_tier, period_start, period_end)
  VALUES (p_business_id, v_alloc, lower(coalesce(p_tier,'free')), now(), now() + interval '30 days')
  ON CONFLICT (business_id) DO NOTHING;

  SELECT * INTO v_row FROM public.marketing_credits WHERE business_id = p_business_id FOR UPDATE;

  -- Refill if period ended OR tier changed upward
  IF v_row.period_end < now() THEN
    v_row.plan_credits_remaining := v_alloc;
    v_row.period_start := now();
    v_row.period_end := now() + interval '30 days';
    v_row.current_tier := lower(coalesce(p_tier,'free'));
    INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason)
    VALUES (p_business_id, v_alloc, 'plan', 'monthly_refill');
  ELSIF lower(coalesce(p_tier,'free')) <> v_row.current_tier THEN
    -- Tier changed mid-period: top up to new allocation if higher
    IF v_alloc > v_row.plan_credits_remaining THEN
      INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason, metadata)
      VALUES (p_business_id, v_alloc - v_row.plan_credits_remaining, 'plan', 'admin_grant', jsonb_build_object('reason','tier_upgrade','from',v_row.current_tier,'to',p_tier));
      v_row.plan_credits_remaining := v_alloc;
    END IF;
    v_row.current_tier := lower(coalesce(p_tier,'free'));
  END IF;

  IF v_row.plan_credits_remaining > 0 THEN
    v_row.plan_credits_remaining := v_row.plan_credits_remaining - 1;
    v_bucket := 'plan';
  ELSIF v_row.topup_credits_remaining > 0 THEN
    v_row.topup_credits_remaining := v_row.topup_credits_remaining - 1;
    v_bucket := 'topup';
  ELSE
    UPDATE public.marketing_credits SET
      plan_credits_remaining = v_row.plan_credits_remaining,
      topup_credits_remaining = v_row.topup_credits_remaining,
      period_start = v_row.period_start,
      period_end = v_row.period_end,
      current_tier = v_row.current_tier,
      updated_at = now()
    WHERE business_id = p_business_id;
    RETURN jsonb_build_object('ok', false, 'reason', 'insufficient',
      'plan_remaining', v_row.plan_credits_remaining,
      'topup_remaining', v_row.topup_credits_remaining);
  END IF;

  UPDATE public.marketing_credits SET
    plan_credits_remaining = v_row.plan_credits_remaining,
    topup_credits_remaining = v_row.topup_credits_remaining,
    period_start = v_row.period_start,
    period_end = v_row.period_end,
    current_tier = v_row.current_tier,
    updated_at = now()
  WHERE business_id = p_business_id;

  INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason)
  VALUES (p_business_id, -1, v_bucket, 'generation');

  RETURN jsonb_build_object('ok', true,
    'plan_remaining', v_row.plan_credits_remaining,
    'topup_remaining', v_row.topup_credits_remaining,
    'bucket', v_bucket);
END;
$$;

-- Refund 1 credit (used when AI generation fails after consume)
CREATE OR REPLACE FUNCTION public.refund_marketing_credit(p_business_id uuid, p_bucket text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_bucket = 'plan' THEN
    UPDATE public.marketing_credits
      SET plan_credits_remaining = plan_credits_remaining + 1, updated_at = now()
      WHERE business_id = p_business_id;
  ELSE
    UPDATE public.marketing_credits
      SET topup_credits_remaining = topup_credits_remaining + 1, updated_at = now()
      WHERE business_id = p_business_id;
  END IF;
  INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason)
  VALUES (p_business_id, 1, p_bucket, 'refund');
END;
$$;

-- Add topup credits (called from stripe webhook)
CREATE OR REPLACE FUNCTION public.add_marketing_topup_credits(p_business_id uuid, p_credits integer, p_session_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.marketing_credits (business_id, topup_credits_remaining)
  VALUES (p_business_id, p_credits)
  ON CONFLICT (business_id) DO UPDATE
    SET topup_credits_remaining = public.marketing_credits.topup_credits_remaining + p_credits,
        updated_at = now();
  INSERT INTO public.marketing_credit_ledger (business_id, delta, bucket, reason, stripe_session_id)
  VALUES (p_business_id, p_credits, 'topup', 'topup', p_session_id);
END;
$$;
