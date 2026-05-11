ALTER TABLE public.developer_accounts
  ADD COLUMN IF NOT EXISTS tier_price_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_subscription_status text,
  ADD COLUMN IF NOT EXISTS monthly_call_limit integer NOT NULL DEFAULT 1000;

UPDATE public.developer_accounts
SET monthly_call_limit = CASE
  WHEN tier::text = 'enterprise' THEN 100000
  WHEN tier::text = 'pro' THEN 10000
  ELSE 1000
END
WHERE monthly_call_limit IS NULL OR monthly_call_limit = 1000;

CREATE INDEX IF NOT EXISTS idx_developer_accounts_stripe_sub
  ON public.developer_accounts (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;